import { CompareTechCard } from "@/lenses/compare/CompareTechCard";
import type { CompareTechData } from "@/lenses/compare/types";

type CompareStripProps = {
  techs: CompareTechData[];
  assignTargetId: string | null;
  dispatchedTechnicianId?: string | null;
  onSelectAssignTarget: (technicianId: string) => void;
};

/** Side-by-side compare when exactly two technicians are selected. */
export function CompareStrip({
  techs,
  assignTargetId,
  dispatchedTechnicianId = null,
  onSelectAssignTarget,
}: CompareStripProps): React.ReactElement {
  return (
    <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 items-stretch gap-3 p-panel-padding">
      {techs.map((tech) => (
        <CompareTechCard
          key={tech.technicianId}
          tech={tech}
          isAssignTarget={assignTargetId === tech.technicianId}
          isAssigned={dispatchedTechnicianId === tech.technicianId}
          assignLocked={dispatchedTechnicianId != null}
          onSelectForAssign={() => onSelectAssignTarget(tech.technicianId)}
        />
      ))}
    </div>
  );
}
