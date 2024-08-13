import { DeepKeysOrExpression, toExp } from "./type";
import { Expression } from "./expression";

export enum OrderByType {
    Asc = 'asc()',
    Desc = 'desc()'
}
export class OrderByItem {
    protected path: Expression;
    protected type: OrderByType;

    constructor(path: Expression, type: OrderByType) {
        this.path = path;
        this.type = type;
    }
    public toString(): string {
        return `${this.path}.${this.type.toString()}`;
    }
}

export class OrderByInfo {
    public items: OrderByItem[] = [];

    constructor(...orderbyItems: OrderByItem[]) {
        this.items.push(...(orderbyItems.filter(item => item !== null)));
    }

    public toString(): string {
        if (this.items.length === 0) return '';
        return this.items
            .filter(item => item !== null)
            .map(item => item.toString())
            .join(',');
    }
    public add(path: Expression, type: OrderByType = OrderByType.Asc): OrderByInfo {
        this.items.push(new OrderByItem(path, type));
        return this;
    }
}
// generic
export class OrderByInfoOf<T> extends OrderByInfo {
    public then(path: DeepKeysOrExpression<T>): OrderByInfoOf<T> {
        this.add(toExp(path), OrderByType.Asc);
        return this;
    }
    public thenDesc(path: DeepKeysOrExpression<T>): OrderByInfoOf<T> {
        this.add(toExp(path), OrderByType.Desc);
        return this;
    }
}
export function orderby<T>(path: DeepKeysOrExpression<T>, type: OrderByType = OrderByType.Asc): OrderByInfoOf<T> {
    const info = new OrderByInfoOf<T>();
    info.add(toExp(path), type);
    return info;
}
