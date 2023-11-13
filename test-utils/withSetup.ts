export function withSetup(hook) {
  let result;

  const app = createApp({
    setup() {
      result = hook();
      return () => {};
    },
  });

  app.mount(document.createElement("div"));

  return [result, app];
}
