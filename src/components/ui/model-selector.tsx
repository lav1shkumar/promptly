"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MODELS, type AIModelId } from "@/lib/ai-models";

const ICON_MAP: Record<string, React.ElementType> = {
  Pro: Sparkles,
  Lite: Zap,
  Flash: Cpu,
};

const BADGE_COLORS: Record<string, string> = {
  Pro: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Lite: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Flash: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

interface ModelSelectorProps {
  value: AIModelId;
  onChange: (model: AIModelId) => void;
  disabled?: boolean;
}

const ModelSelector = ({ value, onChange, disabled }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = AI_MODELS.find((m) => m.id === value) ?? AI_MODELS[0];
  const SelectedIcon = ICON_MAP[selectedModel.badge] ?? Sparkles;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
          "border bg-background/50 hover:bg-accent/50 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-primary/20 border-primary/30",
        )}
      >
        <SelectedIcon className="w-3.5 h-3.5 text-primary" />
        <span className="text-foreground">{selectedModel.name}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full mb-2 left-0 z-50 min-w-[260px]",
            "rounded-xl border bg-popover/95 backdrop-blur-xl shadow-xl",
            "animate-in fade-in slide-in-from-bottom-2 duration-200",
          )}
        >
          <div className="p-1.5">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Select Model
            </p>
            {AI_MODELS.map((model) => {
              const Icon = ICON_MAP[model.badge] ?? Sparkles;
              const isSelected = model.id === value;

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onChange(model.id as AIModelId);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                    "transition-all duration-150",
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent/60 border border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      isSelected
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {model.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-md border",
                          BADGE_COLORS[model.badge],
                        )}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      {model.description} <br />
                      <span className="text-primary/70 font-medium">
                        {model.tokenCost} tokens/request
                      </span>
                    </p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
