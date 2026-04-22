"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  variant = "underline",
  size = "md",
  className,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const activeElement = tabsRef.current[activeIndex];

    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    default: "border-b border-[#E5E7EB] bg-transparent",
    pills: "bg-[#F7F9FB] rounded-lg",
    underline: "border-b-0 bg-transparent",
  };

  const activeClasses = {
    default: "text-primary font-semibold",
    pills: "bg-white shadow-sm text-primary font-medium",
    underline: "text-primary font-semibold",
  };

  const inactiveClasses = {
    default: "text-[#737685] hover:text-[#191C1E]",
    pills: "text-[#737685] hover:text-[#191C1E]",
    underline: "text-[#737685] hover:text-[#191C1E]",
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={cn(
          "relative flex",
          variant === "pills" && "gap-2 p-1 bg-[#F7F9FB] rounded-xl",
          variant === "underline" && "border-b border-[#E5E7EB]"
        )}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 font-medium transition-colors duration-200",
                sizeClasses[size],
                activeTab === tab.id ? activeClasses[variant] : inactiveClasses[variant],
                variant === "pills" && "rounded-lg"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "w-4 h-4",
                    activeTab === tab.id && "text-primary"
                  )}
                />
              )}
              {tab.label}
            </button>
          );
        })}

        {/* Animated Indicator */}
        {variant === "underline" && (
          <div
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        )}
        
        {variant === "pills" && (
          <div
            className="absolute bottom-0 top-0 my-auto h-8 bg-white shadow-sm rounded-lg transition-all duration-300 ease-out"
            style={{
              left: tabs.find((t) => t.id === activeTab)
                ? tabsRef.current[tabs.findIndex((t) => t.id === activeTab)]?.offsetLeft || 0
                : 0,
              width: tabs.find((t) => t.id === activeTab)
                ? tabsRef.current[tabs.findIndex((t) => t.id === activeTab)]?.offsetWidth || 0
                : 0,
            }}
          />
        )}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl bg-white dark:bg-[#111111] overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F7F9FB] dark:hover:bg-[#1A1A1A] transition-colors"
          >
            <span className="font-medium text-[#191C1E] dark:text-[#F1F1EE]">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-[#737685] transition-transform duration-300",
                openIds.has(item.id) && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIds.has(item.id) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="p-4 pt-0 text-[#434654] dark:text-[#888888]">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}