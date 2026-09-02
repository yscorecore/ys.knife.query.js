import { con } from "./constant";
import { exp } from "./expression";
import { DeepKeysOrConstantOrExpression, ConstantOrExpression, toValueExp } from "./type";
export enum Operator {
    Equals = "==",
    NotEquals = "!=",
    GreaterThan = ">",
    LessThanOrEqual = "<=",
    LessThan = "<",
    GreaterThanOrEqual = ">=",
    Between = "between",
    NotBetween = "not_between",
    In = "in",
    NotIn = "not_in",
    StartsWith = "startswith",
    NotStartsWith = "not_startswith",
    EndsWith = "endswith",
    NotEndsWith = "not_endswith",
    Contains = "contains",
    NotContains = "not_contains",
}
export enum CombinType {
    AndItems = 1,
    OrItems = 2,
    SingleItem = 0,
}
interface SimpleFilterObject {
    name: string,
    op?: Operator | undefined | null,
    value: any,
}
export class FilterInfo {
    static readonly Operator_And = "and";
    static readonly Operator_Or = "or";

    protected left: ConstantOrExpression | null | undefined;
    protected right: ConstantOrExpression | null | undefined;
    protected op: Operator | null | undefined;
    protected combinType: CombinType;
    protected items: FilterInfo[] = [];

    constructor(left: ConstantOrExpression | null, op: Operator | null, right: ConstantOrExpression | null, combinType: CombinType = CombinType.SingleItem, items: FilterInfo[] = []) {
        this.left = left;
        this.right = right;
        this.op = op;
        this.combinType = combinType;
        this.items = items;
    }


    toString(): string {
        switch (this.combinType) {
            case CombinType.AndItems: {
                const notNullItems = this.items.filter(item => item && !item.isEmpty());
                return notNullItems.length === 1 ? `${notNullItems[0].toString()}` :
                    notNullItems.map(item => `(${item.toString()})`).join(` ${FilterInfo.Operator_And} `);
            }
            case CombinType.OrItems: {
                const notNullItems2 = this.items.filter(item => item && !item.isEmpty());
                return notNullItems2.length === 1 ? `${notNullItems2[0].toString()}` :
                    notNullItems2.map(item => `(${item.toString()})`).join(` ${FilterInfo.Operator_Or} `);
            }
            default:
                return this.isEmpty() ? "" : `${this.left} ${this.op} ${this.right}`;
        }
    }


    public andAlso(other: FilterInfo): FilterInfo {
        if (this.combinType == CombinType.AndItems) {
            if (other.combinType == CombinType.AndItems) {
                this.items = this.items.concat(other.items);
            }
            else {
                this.items.push(other)
            }
            return this;
        }
        else {
            return FilterInfo.createAnd(this, other);
        }
    }

    public orElse(other: FilterInfo): FilterInfo {
        if (this.combinType == CombinType.OrItems) {
            if (other.combinType == CombinType.OrItems) {
                this.items = this.items.concat(other.items);
            }
            else {
                this.items.push(other);
            }
            return this;
        }
        else {
            return FilterInfo.createOr(this, other);
        }
    }

    public static createOr(...items: FilterInfo[]): FilterInfo {
        return new FilterInfo(null, null, null, CombinType.OrItems, items);
    }
    public static createAnd(...items: FilterInfo[]): FilterInfo {
        return new FilterInfo(null, null, null, CombinType.AndItems, items);
    }
    public isEmpty(): boolean {
        return this.combinType == CombinType.SingleItem && this.op == null;
    }
    public static fromSimpleObject(...obj: SimpleFilterObject[]): FilterInfo {
        return FilterInfo.createAnd(...obj.map(item => new FilterInfo(exp(item.name), item.op ?? Operator.Equals, con(item.value))));
    }
    public static fromSimpleDictionary(dic: Record<string, any>): FilterInfo {
        return FilterInfo.fromSimpleObject(...Object.entries(dic).map(([key, value]) => ({ name: key, value })));
    }
}

export const empty = new FilterInfo(con(1), Operator.Equals, con(1));

export class FilterInfoOf<T> extends FilterInfo {
    constructor(left: DeepKeysOrConstantOrExpression<T> | null, op: Operator | null, right: DeepKeysOrConstantOrExpression<T> | null, combinType: CombinType = CombinType.SingleItem, items: FilterInfo[] = []) {
        super(toValueExp(left), op, toValueExp(right), combinType, items);
    }

    public and(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
        const other = new FilterInfoOf<T>(left, op, right);
        if (this.combinType == CombinType.AndItems) {
            if (other.combinType == CombinType.AndItems) {
                this.items = this.items.concat(other.items);
            }
            else {
                this.items.push(other)
            }
            return this;
        }
        else {
            return new FilterInfoOf<T>(null, null, null, CombinType.AndItems, [this, other]);
        }
    }
    public or(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
        const other = new FilterInfoOf<T>(left, op, right);
        if (this.combinType == CombinType.OrItems) {
            if (other.combinType == CombinType.OrItems) {
                this.items = this.items.concat(other.items);
            }
            else {
                this.items.push(other);
            }
            return this;
        }
        else {
            return new FilterInfoOf<T>(null, null, null, CombinType.OrItems, [this, other]);
        }
    }
    public andIf(condition: boolean, left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>) {
        if (condition) {
            return this.and(left, op, right);
        }
        return this;
    }
    public orIf(condition: boolean, left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>) {
        if (condition) {
            return this.or(left, op, right);
        }
        return this;
    }



}

export function filter<T>(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
    return new FilterInfoOf<T>(left, op, right);
}
export function emptyFilter<T>(): FilterInfoOf<T> {
    return new FilterInfoOf<T>(con(null), null, con(null));
}

