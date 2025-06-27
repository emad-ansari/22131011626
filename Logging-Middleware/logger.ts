export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Package =
  | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

const LOG_API_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";


const allowedStacks: Stack[] = ["backend", "frontend"];
const allowedLevels: Level[] = ["debug", "info", "warn", "error", "fatal"];
const allowedPackages: Package[] = [
  "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils"
];

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  
  if (!allowedStacks.includes(stack)) {
    console.warn(`[Logger] Invalid stack: ${stack}`);
    return;
  }
  if (!allowedLevels.includes(level)) {
    console.warn(`[Logger] Invalid level: ${level}`);
    return;
  }
  if (!allowedPackages.includes(pkg)) {
    console.warn(`[Logger] Invalid package: ${pkg}`);
    return;
  }

  try {

    await fetch(LOG_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (error) {
    // Fail silently as per requirements
  }
}