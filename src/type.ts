import { Expression } from "./expression";
import { Constant } from "./constant";

export type DeepKeys<T> = T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
    : never;

export type Keys<T> = {
    [K in keyof T]: K;
}[keyof T];


export type ConstantOrExpression = Constant | Expression;

export type DeepKeysOrExpression<T> = DeepKeys<T> | Expression;

export type DeepKeysOrConstantOrExpression<T> = keyof T| DeepKeys<T> | ConstantOrExpression;

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
        return new Expression(path);
    }
}


