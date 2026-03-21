const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export function GET() {
  return new Response(`window.__GA_MEASUREMENT_ID__ = ${JSON.stringify(measurementId)};\n`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
