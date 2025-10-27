export default function log(...args: Parameters<typeof console.log>) {
  if (process.env.LOGGER === "custom") {
    return console.log(`[${new Date().toISOString()}]: `, ...args);
  }
  return console.log(...args);
}
