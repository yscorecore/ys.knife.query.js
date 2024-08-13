import { DeepKeys } from "./path";

export enum OrderByType {
    Asc = 'asc()',
    Desc = 'desc()'
}
export class OrderByItem {
    public Path: string = "";
    public OrderByType: OrderByType;

    constructor(path: string, type: OrderByType) {
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
    public add(path: string, type: OrderByType = OrderByType.Asc): OrderByInfo {
        this.Items.push(new OrderByItem(path, type));
        return this;
    }
}
export class OrderByInfoOf<T> extends OrderByInfo {
    public then(path: DeepKeys<T>): OrderByInfoOf<T> {
        this.Items.push(new OrderByItem(path,  OrderByType.Asc));
        return this;
    }
    public thenDesc(path: DeepKeys<T>): OrderByInfoOf<T> {
        this.Items.push(new OrderByItem(path, OrderByType.Desc));
        return this;
    }
    public add(path: string, type: OrderByType): OrderByInfo {
        this.Items.push(new OrderByItem(path, type));
        return this;
    }
}
export function orderby<T>(path: DeepKeys<T>, type: OrderByType = OrderByType.Asc):OrderByInfoOf<T>{
    const info = new OrderByInfoOf<T>();
    info.add(path,type);
    return info;
}
