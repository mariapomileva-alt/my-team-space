export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export async function onRequestError(
  error: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { get(name: string): string | null };
  },
) {
  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error);
    return;
  }
  const { captureMonitoringException } = await import("@/lib/monitoring/sentry");
  captureMonitoringException(error, {
    route: request.path,
    action: request.method,
    digest: error.digest,
  });
}
