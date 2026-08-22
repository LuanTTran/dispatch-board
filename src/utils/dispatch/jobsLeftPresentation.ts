import type { OsdkDispatchAssignment } from "@dispatch-command-board/sdk";

type AssignmentInstance = OsdkDispatchAssignment.OsdkInstance;

const ACTIVE_ASSIGNMENT_STATUSES = new Set(["confirmed", "pending"]);

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

/** Counts confirmed and pending assignments scheduled today per technician. */
export function countActiveAssignmentsTodayByTechnician(
  assignments: readonly AssignmentInstance[],
  nowMs: number = Date.now(),
): Map<string, number> {
  const now = new Date(nowMs);
  const counts = new Map<string, number>();

  for (const assignment of assignments) {
    const technicianId = assignment.technicianId;
    const status = assignment.status;
    const assignedAt = assignment.assignedAt;

    if (
      technicianId == null ||
      status == null ||
      !ACTIVE_ASSIGNMENT_STATUSES.has(status) ||
      assignedAt == null
    ) {
      continue;
    }

    if (!isSameLocalDay(new Date(assignedAt), now)) {
      continue;
    }

    counts.set(technicianId, (counts.get(technicianId) ?? 0) + 1);
  }

  return counts;
}

/** Technicians with at least one confirmed assignment assigned today. */
export function confirmedAssignmentTodayByTechnician(
  assignments: readonly AssignmentInstance[],
  nowMs: number = Date.now(),
): Set<string> {
  const now = new Date(nowMs);
  const confirmed = new Set<string>();

  for (const assignment of assignments) {
    const technicianId = assignment.technicianId;
    const status = assignment.status;
    const assignedAt = assignment.assignedAt;

    if (
      technicianId == null ||
      status !== "confirmed" ||
      assignedAt == null
    ) {
      continue;
    }

    if (!isSameLocalDay(new Date(assignedAt), now)) {
      continue;
    }

    confirmed.add(technicianId);
  }

  return confirmed;
}

export function parseMaxDailyJobs(
  maxDailyJobs: number | string | undefined,
): number | undefined {
  if (maxDailyJobs == null) {
    return undefined;
  }

  if (typeof maxDailyJobs === "number") {
    return Number.isFinite(maxDailyJobs) ? maxDailyJobs : undefined;
  }

  const parsed = Number.parseInt(maxDailyJobs, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function computeJobsLeft(
  maxDailyJobs: number | string | undefined,
  assignmentsToday: number,
): number | null {
  const cap = parseMaxDailyJobs(maxDailyJobs);
  if (cap == null) {
    return null;
  }

  return Math.max(0, cap - assignmentsToday);
}

export function formatJobsLeftLabel(
  maxDailyJobs: number | string | undefined,
  assignmentsToday: number,
): string {
  const jobsLeft = computeJobsLeft(maxDailyJobs, assignmentsToday);
  if (jobsLeft == null) {
    return "—";
  }

  if (jobsLeft === 1) {
    return "1 job left today";
  }

  return `${jobsLeft} jobs left today`;
}
