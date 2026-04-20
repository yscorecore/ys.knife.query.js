import { Expression } from "./expression";
import { Constant } from "./constant";

export type DeepKeys<T, D extends number = 10> = D extends 0
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? `${K}` | `${K}.${DeepKeys<T[K], Mminus<D>>}`
        : never;
    }[keyof T]
    : never;

type Mminus<T extends number> = T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : T extends 4 ? 3 : T extends 5 ? 4 : T extends 6 ? 5 : T extends 7 ? 6 : T extends 8 ? 7 : T extends 9 ? 8 : T extends 10 ? 9 : 0;

export type Keys<T> = {
    [K in keyof T]: K;
}[keyof T];


export type ConstantOrExpression = Constant | Expression;

export type DeepKeysOrExpression<T> = DeepKeys<T> | Expression;

export type DeepKeysOrConstantOrExpression<T> = keyof T | DeepKeys<T> | ConstantOrExpression;

export function key<T>(prop: DeepKeys<T>): string {
    return prop.toString();
}

export function toExp<T>(path: DeepKeysOrExpression<T>): Expression {
    if (path instanceof Expression) {
        return path;
    } else {
        return new Expression(path);
    }
}
export function toValueExp<T>(path: DeepKeysOrConstantOrExpression<T> | null): ConstantOrExpression | null {
    if (path == null) {
        return null;
    } else if (path instanceof Expression) {
        return path;
    } else if (path instanceof Constant) {
        return path;
    } else {
        return new Expression(path as string);
    }
}


