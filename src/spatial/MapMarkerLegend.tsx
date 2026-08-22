import { CircleHelp } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type MapMarkerLegendProps = {
  className?: string;
};

type LegendRowProps = {
  swatch: React.ReactNode;
  label: string;
  detail?: string;
};

function LegendRow({ swatch, label, detail }: LegendRowProps): React.ReactElement {
  return (
    <li className="flex items-start gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center">{swatch}</div>
      <div className="min-w-0 space-y-0.5 pt-0.5">
        <p className="text-sm leading-none font-medium text-foreground">{label}</p>
        {detail != null ? (
          <p className="text-xs leading-snug text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </li>
  );
}

function LegendSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </section>
  );
}

/** Header control explaining site, technician, and hub pin symbology. */
export function MapMarkerLegend({ className }: MapMarkerLegendProps): React.ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "relative shrink-0",
          className,
        )}
        aria-label="Map marker legend"
      >
        <CircleHelp aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="w-60 p-3"
      >
        <p className="mb-3 text-sm font-medium text-foreground">Map markers</p>

        <div className="space-y-3">
          <LegendSection title="Sites">
            <LegendRow
              label="Critical SLA"
              detail="Past due or at highest risk"
              swatch={
                <div className="site-marker-pin site-marker-pin--critical" aria-hidden />
              }
            />
            <LegendRow
              label="Warning SLA"
              detail="Approaching deadline"
              swatch={
                <div className="site-marker-pin site-marker-pin--warning" aria-hidden />
              }
            />
            <LegendRow
              label="Normal SLA"
              swatch={
                <div className="site-marker-pin site-marker-pin--normal" aria-hidden />
              }
            />
            <LegendRow
              label="Multiple open jobs"
              detail="Number shows jobs at that site"
              swatch={
                <div className="site-marker-pin site-marker-pin--warning" aria-hidden>
                  <span className="site-marker-count">2</span>
                </div>
              }
            />
          </LegendSection>

          <LegendSection title="Technicians">
            <LegendRow
              label="Last known position"
              swatch={
                <div className="tech-marker-pin" aria-hidden>
                  <span className="tech-marker-triangle" />
                </div>
              }
            />
            <LegendRow
              label="Selected for compare"
              swatch={
                <div className="tech-marker-pin tech-marker-pin--compare" aria-hidden>
                  <span className="tech-marker-triangle" />
                </div>
              }
            />
          </LegendSection>

          <LegendSection title="Reference">
            <LegendRow
              label="Chicago hub"
              detail="Central parts warehouse"
              swatch={<div className="hub-marker-pin" aria-hidden />}
            />
          </LegendSection>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
