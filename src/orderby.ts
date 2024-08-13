import { DeepKeys, DeepKeysOrExpression, toExp } from "./type";
import { Expression } from "./expression";

export enum OrderByType {
    Asc = 'asc()',
    Desc = 'desc()'
}
export class OrderByItem {
    public Path: Expression;
    public OrderByType: OrderByType;

    constructor(path: Expression, type: OrderByType) {
        this.Path = path;
        this.OrderByType = type;
    }
    public toString(): string {
        return `${this.Path}.${this.OrderByType.toString()}`;
    }
}

export class OrderByInfo {
    public Items: OrderByItem[] = [];

    constructor(...orderbyItems: OrderByItem[]) {
        this.Items.push(...(orderbyItems.filter(item => item !== null)));
    }

    public toString(): string {
        if (this.Items.length === 0) return '';
        return this.Items
            .filter(item => item !== null)
            .map(item => item.toString())
            .join(',');
    }
    public add(path: Expression, type: OrderByType = OrderByType.Asc): OrderByInfo {
        this.Items.push(new OrderByItem(path, type));
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
