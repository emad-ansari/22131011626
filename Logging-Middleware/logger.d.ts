declare module '@logger/logger' {
  export function Log(stack: string, level: string, pkg: string, message: string): Promise<void>;
}