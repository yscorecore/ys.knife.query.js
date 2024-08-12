
type DeepKeys<T> = T extends object
    ? {
        [K in keyof T]-?: K extends string
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
    : never;

export function path<T>(prop: DeepKeys<T>): string {
    return prop.toString();
}

