import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from .config import DEFAULT_SCAN_INTERVAL_HOURS, REQUEST_DELAY_SECONDS
from .collectors import (
    NSPCollector,
    DigitalGujaratCollector,
    AICTECollector,
    UGCCollector,
    MYSYCollector,
)
from .sync_service import sync_scholarship
from .db import record_intelligence_run, update_source_status, get_db_connection

logger = logging.getLogger("edvora.scheduler")

class IntelligenceScheduler:
    """
    Automated background scheduler for scholarship discovery, extraction,
    verification, and database updates.
    Runs continuously on a 24-hour interval or on-demand manual trigger.
    """
    def __init__(self, interval_hours: int = DEFAULT_SCAN_INTERVAL_HOURS):
        self.interval_seconds = interval_hours * 3600
        self.interval_hours = interval_hours
        self.is_running = False
        self.is_scanning = False
        self._task: Optional[asyncio.Task] = None
        self.last_run_summary: Optional[Dict[str, Any]] = None
        self.next_run_time: Optional[datetime] = None

    def start(self):
        """Starts the persistent background loop."""
        if self.is_running:
            return
        self.is_running = True
        self.next_run_time = datetime.now() + timedelta(seconds=self.interval_seconds)
        self._task = asyncio.create_task(self._background_loop())
        logger.info(f"Intelligence Scheduler started (Interval: {self.interval_hours}h).")

    def stop(self):
        """Stops the scheduler loop."""
        self.is_running = False
        if self._task and not self._task.done():
            self._task.cancel()
        logger.info("Intelligence Scheduler stopped.")

    async def _background_loop(self):
        """Infinite loop sleeping for interval_seconds between scans."""
        while self.is_running:
            try:
                await asyncio.sleep(self.interval_seconds)
                logger.info("Scheduled interval reached. Triggering automatic collection cycle...")
                await self.run_cycle(trigger_type="scheduled")
                self.next_run_time = datetime.now() + timedelta(seconds=self.interval_seconds)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in background scheduler loop: {e}")
                await asyncio.sleep(60)

    async def run_cycle(self, trigger_type: str = "scheduled") -> Dict[str, Any]:
        """
        Executes a complete discovery, extraction, verification, and database sync cycle.
        Thread-safe: skips if an existing scan is currently in progress.
        """
        if self.is_scanning:
            return {
                "status": "already_running",
                "message": "A discovery cycle is already in progress.",
            }

        self.is_scanning = True
        started_at = datetime.now().isoformat()
        start_time_perf = time.time()

        collectors = [
            ("nsp", "National Scholarship Portal", NSPCollector()),
            ("digital_gujarat", "Digital Gujarat", DigitalGujaratCollector()),
            ("mysy_gujarat", "Mukhyamantri Yuva Swavalamban Yojana (MYSY)", MYSYCollector()),
            ("aicte", "AICTE India", AICTECollector()),
            ("ugc", "UGC India", UGCCollector()),
        ]

        total_discovered = 0
        total_updated = 0
        total_unchanged = 0
        sources_checked = 0
        failed_sources: List[str] = []
        source_details: Dict[str, Any] = {}

        logger.info(f"=== Starting Intelligence Scan ({trigger_type.upper()}) ===")

        for source_id, source_name, collector in collectors:
            sources_checked += 1
            source_start = time.time()

            try:
                # Rate limit pause between sources
                await asyncio.sleep(REQUEST_DELAY_SECONDS)

                # Run collector in thread pool to avoid blocking async event loop
                extracted_items = await asyncio.to_thread(collector.collect)

                source_disc = 0
                source_upd = 0
                source_unc = 0

                for item in extracted_items:
                    action, _ = sync_scholarship(item)
                    if action == "inserted":
                        source_disc += 1
                    elif action == "updated":
                        source_upd += 1
                    else:
                        source_unc += 1

                total_discovered += source_disc
                total_updated += source_upd
                total_unchanged += source_unc

                elapsed = round(time.time() - source_start, 2)
                update_source_status(source_id, "ok", None, len(extracted_items))
                source_details[source_id] = {
                    "status": "ok",
                    "schemes_found": len(extracted_items),
                    "discovered": source_disc,
                    "updated": source_upd,
                    "time_seconds": elapsed,
                }
                logger.info(f"[{source_name}] OK: {len(extracted_items)} schemes ({elapsed}s)")

            except Exception as e:
                err_msg = str(e)
                failed_sources.append(source_id)
                update_source_status(source_id, "error", err_msg, 0)
                source_details[source_id] = {
                    "status": "error",
                    "error": err_msg,
                }
                logger.warn(f"[{source_name}] FAILED: {err_msg}")

        completed_at = datetime.now().isoformat()
        total_elapsed = round(time.time() - start_time_perf, 2)
        overall_status = "success" if not failed_sources else ("partial" if total_discovered > 0 or total_updated > 0 else "failed")

        log_summary = (
            f"Scan finished in {total_elapsed}s. "
            f"Sources: {sources_checked - len(failed_sources)}/{sources_checked} OK. "
            f"Discovered: {total_discovered}, Updated: {total_updated}, Unchanged: {total_unchanged}."
        )

        run_id = record_intelligence_run(
            started_at=started_at,
            completed_at=completed_at,
            status=overall_status,
            sources_checked=sources_checked,
            discovered_count=total_discovered,
            updated_count=total_updated,
            failed_sources=failed_sources,
            log_summary=log_summary,
            trigger_type=trigger_type,
        )

        summary = {
            "run_id": run_id,
            "started_at": started_at,
            "completed_at": completed_at,
            "status": overall_status,
            "duration_seconds": total_elapsed,
            "sources_checked": sources_checked,
            "discovered_count": total_discovered,
            "updated_count": total_updated,
            "unchanged_count": total_unchanged,
            "failed_sources": failed_sources,
            "log_summary": log_summary,
            "source_details": source_details,
            "trigger_type": trigger_type,
        }

        self.last_run_summary = summary
        self.is_scanning = False
        logger.info(f"=== Scan Completed: {log_summary} ===")
        return summary

# Global singleton scheduler instance
scheduler = IntelligenceScheduler()
