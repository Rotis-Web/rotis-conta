export default defineEventHandler(async (event) => {
  const start = Date.now();
  const { req } = event.node;

  if (req.url?.startsWith("/api")) {
    event.node.res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[API] ${req.method} ${req.url} → ${event.node.res.statusCode} (${duration}ms)`
      );
    });
  }
});
