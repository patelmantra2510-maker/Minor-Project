"use client";

import * as React from "react";
import { useEffect, useRef, useState, useLayoutEffect } from "react";

export interface TabItem {
  label: string;
  key?: string;
  icon?: React.ReactNode;
  badgeCount?: number;
}

export interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  className = "",
  containerClassName = "",
  activeClassName = "",
  inactiveClassName = "",
}: AnimatedTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.key || tabs[0]?.label || "");
  const isControlled = controlledActiveTab !== undefined;
  const currentActive = isControlled ? controlledActiveTab : internalActiveTab;

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  const handleTabClick = (tab: TabItem) => {
    const value = tab.key || tab.label;
    if (!isControlled) {
      setInternalActiveTab(value);
    }
    onTabChange?.(value);
  };

  const updateClipPath = () => {
    const container = containerRef.current;
    const activeElement = activeTabRef.current;

    if (container && activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      const clipLeft = offsetLeft;
      const clipRight = offsetLeft + offsetWidth;

      const leftPercent = (clipLeft / container.offsetWidth) * 100;
      const rightPercent = 100 - (clipRight / container.offsetWidth) * 100;

      container.style.clipPath = `inset(0 ${Number(rightPercent).toFixed(2)}% 0 ${Number(leftPercent).toFixed(2)}% round 9999px)`;
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isFirstRender.current) {
      container.style.transition = "none";
      updateClipPath();
      const raf = requestAnimationFrame(() => {
        if (container) {
          container.style.transition = "clip-path 0.26s cubic-bezier(0.4, 0, 0.2, 1)";
        }
        isFirstRender.current = false;
      });
      return () => cancelAnimationFrame(raf);
    } else {
      updateClipPath();
    }
  }, [currentActive, tabs]);

  useEffect(() => {
    window.addEventListener("resize", updateClipPath);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateClipPath);
    }
    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  return (
    <div className={`relative mx-auto flex w-fit items-center rounded-full ${className}`}>
      {/* Clipped Active Overlay Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none [clip-path:inset(0px_75%_0px_0%_round_9999px)]"
      >
        <div
          className={`relative flex w-full h-full items-center justify-center bg-[#EAF3EE] dark:bg-emerald-950/80 border border-[#D1E7DD] dark:border-emerald-800/80 shadow-2xs rounded-full ${activeClassName}`}
        >
          {tabs.map((tab, index) => {
            const key = tab.key || tab.label;
            return (
              <button
                key={key || index}
                type="button"
                tabIndex={-1}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#064E3B] dark:text-emerald-300 whitespace-nowrap"
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unclipped Base Tabs Layer */}
      <div className={`relative flex w-full items-center justify-center ${containerClassName}`}>
        {tabs.map((tab, index) => {
          const key = tab.key || tab.label;
          const isActive = currentActive === key || currentActive === tab.label;

          return (
            <button
              key={key || index}
              ref={isActive ? activeTabRef : null}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer text-stone-700 dark:text-stone-300 hover:text-[#064E3B] dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#065F46] whitespace-nowrap ${inactiveClassName}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
