import { DeepKeysOrConstantOrExpression, ConstantOrExpression, toValueExp } from "./type";
export enum Operator {
    Equals = "==",
    NotEquals = "!=",
    GreaterThan = ">",
    LessThanOrEqual = "<=",
    LessThan = "<",
    GreaterThanOrEqual = ">=",
    Between = "between",
    NotBetween = "not between",
    In = "in",
    NotIn = "not in",
    StartsWith = "starts",
    NotStartsWith = "not starts",
    EndsWith = "ends",
    NotEndsWith = "not ends",
    Contains = "contains",
    NotContains = "not contains",
}
export enum CombinType {
    AndItems = 1,
    OrItems = 2,
    SingleItem = 0,
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
            case CombinType.AndItems:
                return this.items.filter(item => item !== null)
                    .map(item => `(${item.toString()})`)
                    .join(` ${FilterInfo.Operator_And} `);
            case CombinType.OrItems:
                return this.items.filter(item => item !== null)
                    .map(item => `(${item.toString()})`)
                    .join(` ${FilterInfo.Operator_Or} `);
            default:
                return `${this.left} ${this.op} ${this.right}`;
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

}


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
}

export function filter<T>(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
    return new FilterInfoOf<T>(left, op, right);
}
