export enum OrderByType {
    Asc = 'asc()',
    Desc = 'desc()'
}
export class OrderByItem {
    public Path: string = "";
    public OrderByType: OrderByType;

    constructor(path: string, type: OrderByType = OrderByType.Asc) {
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
    public then(path: string, type: OrderByType = OrderByType.Asc): OrderByInfo {
        this.Items.push(new OrderByItem(path, type));
        return this;
    }
    public thenDesc(path: string): OrderByInfo {
        return this.then(path, OrderByType.Desc);
    }

    public static create(path: string, type: OrderByType = OrderByType.Asc): OrderByInfo {
        return new OrderByInfo(new OrderByItem(path, type));
    }
}
