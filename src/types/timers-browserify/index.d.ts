declare module 'timers-browserify' {
  export function setImmediate(callback: (...args: any[]) => void, ...args: any[]): NodeJS.Immediate;
  export function clearImmediate(immediateId: NodeJS.Immediate): void;
}