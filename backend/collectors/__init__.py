"""
Official Source Collectors Package for Edvora Intelligence System
"""
from .nsp_collector import NSPCollector
from .digital_gujarat_collector import DigitalGujaratCollector
from .aicte_collector import AICTECollector
from .ugc_collector import UGCCollector
from .mysy_collector import MYSYCollector

__all__ = [
    "NSPCollector",
    "DigitalGujaratCollector",
    "AICTECollector",
    "UGCCollector",
    "MYSYCollector",
]
