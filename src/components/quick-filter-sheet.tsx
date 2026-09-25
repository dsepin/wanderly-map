import { useState } from "react";
import { ChevronDown, Layers3, Wallet, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useGlobeTrotter } from "@/contexts/globetrotter-context";
import { BUDGET_LEVELS, FILTER_GROUPS, PRESETS, type FacetGroupId } from "@/lib/discovery";
import { cn } from "@/lib/utils";

/** Anasayfada genis acmayan, ayri sayfa (dialog) icinde alt alta tum secenekleri gosteren hizli filtre paneli. */
export function QuickFilterSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    facets,
    toggleFacet,
    toggleFacetParent,
    setFreeOnly,
    applyPreset,
    clearFacetFilters,
    facetCount,
    totalFacetCount,
  } = useGlobeTrotter();
  const [openGroup, setOpenGroup] = useState<FacetGroupId | null>("experience");

  const chip = (active: boolean) =>
    cn(
      "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition",
      active
        ? "border-terracotta bg-terracotta text-terracotta-foreground shadow-travel"
        : "border-border bg-background text-foreground hover:border-terracotta/50",
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-glass-border bg-card/95 shadow-glass backdrop-blur-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <Layers3 className="size-5 text-terracotta" />
            Hızlı Filtre
          </DialogTitle>
          <DialogDescription>
            Tüm filtre seçeneklerini alt alta gör, istediğine dokun.
          </DialogDescription>
        </DialogHeader>

        {totalFacetCount > 0 ? (
          <div className="flex items-center justify-between rounded-xl bg-terracotta/10 px-3 py-2">
            <span className="text-sm font-semibold text-terracotta">
              {totalFacetCount} filtre aktif
            </span>
            <Button variant="ghost" size="sm" onClick={clearFacetFilters}>
              Tümünü Temizle
            </Button>
          </div>
        ) : null}

        <section className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hazır tarzlar
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm font-semibold transition",
                  "text-foreground hover:border-terracotta/50 hover:text-terracotta",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3">
          {FILTER_GROUPS.map((group) => {
            const list = facets[group.id] as string[];
            const expanded = openGroup === group.id;
            const count = facetCount(group.id);
            return (
              <section
                key={group.id}
                className="overflow-hidden rounded-2xl border border-border bg-background/70"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 p-4 text-left"
                  onClick={() => setOpenGroup(expanded ? null : group.id)}
                  aria-expanded={expanded}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{group.title}</span>
                    <span className="block text-xs text-muted-foreground">{group.hint}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {count > 0 ? (
                      <span className="grid min-w-6 place-items-center rounded-full bg-terracotta px-1.5 py-0.5 text-[11px] font-bold text-terracotta-foreground">
                        {count}
                      </span>
                    ) : null}
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                {expanded ? (
                  <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
                    {group.parents?.map((parent) => {
                      const selected = parent.children.filter((c) => list.includes(c.id));
                      const all = selected.length === parent.children.length;
                      return (
                        <div key={parent.id} className="rounded-xl bg-muted/60 p-3">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-2 text-left text-[13px] font-semibold"
                            onClick={() =>
                              toggleFacetParent(
                                group.id,
                                parent.children.map((c) => c.id),
                              )
                            }
                          >
                            <span>
                              {parent.label}{" "}
                              <span className="font-normal text-muted-foreground">
                                ({selected.length}/{parent.children.length})
                              </span>
                            </span>
                            <span className="text-xs font-medium text-terracotta">
                              {all ? "Bırak" : "Tümü"}
                            </span>
                          </button>
                          <div className="mt-2 flex flex-col gap-2">
                            {parent.children.map((child) => (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => toggleFacet(group.id, child.id)}
                                className={chip(list.includes(child.id))}
                                aria-pressed={list.includes(child.id)}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {group.singles && group.custom !== "time" ? (
                      <div className="flex flex-col gap-2">
                        {group.singles.map((single) => (
                          <button
                            key={single.id}
                            type="button"
                            onClick={() => toggleFacet(group.id, single.id)}
                            className={chip(list.includes(single.id))}
                            aria-pressed={list.includes(single.id)}
                          >
                            {single.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {group.custom === "budget" ? (
                      <div className="flex flex-col gap-2">
                        <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm font-medium">
                          <span className="flex items-center gap-2">
                            <Wallet className="size-4" />
                            Ücretsiz etkinlikler
                          </span>
                          <Switch
                            checked={facets.freeOnly}
                            onCheckedChange={setFreeOnly}
                            aria-label="Ücretsiz etkinlikler"
                          />
                        </label>
                        {BUDGET_LEVELS.map((level) => (
                          <button
                            key={level.level}
                            type="button"
                            onClick={() => toggleFacet("budget", level.level)}
                            className={chip(facets.budget.includes(level.level))}
                            aria-pressed={facets.budget.includes(level.level)}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {group.custom === "time" ? (
                      <div className="flex flex-col gap-2">
                        {group.singles?.map((single) => (
                          <button
                            key={single.id}
                            type="button"
                            onClick={() => toggleFacet("time", single.id)}
                            className={chip(facets.time.includes(single.id))}
                            aria-pressed={facets.time.includes(single.id)}
                          >
                            {single.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            clearFacetFilters();
            onOpenChange(false);
          }}
        >
          <X className="size-4" />
          Kapat ve filtreleri sıfırla
        </Button>
      </DialogContent>
    </Dialog>
  );
}
