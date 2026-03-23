export function GET() {
  return new Response("google-site-verification: google5a11a980cd1fa9fb.html", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
