import { logger } from "@/lib/monitoring/logger";

export const PerfThresholdsMs = {
  publish: 3000,
  autosave: 1000,
  db_query: 500,
  webhook: 2000,
  upload: 3000,
  builder_load: 3000,
  dashboard_load: 3000,
  server_action: 2000,
} as const;

export type PerfLabel = keyof typeof PerfThresholdsMs;

export async function withDurationLog<T>(
  label: PerfLabel,
  action: string,
  fn: () => Promise<T>,
  extra?: Record<string, unknown>,
): Promise<T> {
  const started = Date.now();
  try {
    return await fn();
  } finally {
    const duration_ms = Date.now() - started;
    const threshold = PerfThresholdsMs[label];
    if (duration_ms >= threshold) {
      logger.warn("slow_operation", {
        event: "slow_operation",
        action,
        duration_ms,
        status: "slow",
        error_code: `SLOW_${label.toUpperCase()}`,
        threshold_ms: threshold,
        ...extra,
      });
    }
  }
}
