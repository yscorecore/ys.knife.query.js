import { DeepKeysOrConstantOrExpression, ConstantOrExpression, toValueExp } from "./type";
export enum Operator {
    Equals = "==",
    NotEquals = "!=",
    GreaterThan = ">",
    LessThanOrEqual = "<=",
    LessThan = "<",
    GreaterThanOrEqual = ">",
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
export enum CombinSymbol {
    AndItems = 1,
    OrItems = 2,
    SingleItem = 0,
}

export class FilterInfo {
    static readonly Operator_And = "and";
    static readonly Operator_Or = "or";

    protected Left: ConstantOrExpression | null | undefined;
    protected Right: ConstantOrExpression | null | undefined;
    protected Operator: Operator | null | undefined;
    protected CombinType: CombinSymbol;
    protected Items: FilterInfo[] = [];

    constructor(left: ConstantOrExpression | null, op: Operator | null, right: ConstantOrExpression | null, combinType: CombinSymbol = CombinSymbol.SingleItem, items: FilterInfo[] = []) {
        this.Left = left;
        this.Right = right;
        this.Operator = op;
        this.CombinType = combinType;
        this.Items = items;
    }


    toString(): string {
        switch (this.CombinType) {
            case CombinSymbol.AndItems:
                return this.Items.filter(item => item !== null)
                    .map(item => `(${item.toString()})`)
                    .join(` ${FilterInfo.Operator_And} `);
            case CombinSymbol.OrItems:
                return this.Items.filter(item => item !== null)
                    .map(item => `(${item.toString()})`)
                    .join(` ${FilterInfo.Operator_Or} `);
            default:
                return `${this.Left} ${this.Operator} ${this.Right}`;
        }
    }


    public andAlso(other: FilterInfo): FilterInfo {
        if (this.CombinType == CombinSymbol.AndItems) {
            if (other.CombinType == CombinSymbol.AndItems) {
                this.Items = this.Items.concat(other.Items);
            }
            else {
                this.Items.push(other)
            }
            return this;
        }
        else {
            return FilterInfo.createAnd(this, other);
        }
    }

    public orElse(other: FilterInfo): FilterInfo {
        if (this.CombinType == CombinSymbol.OrItems) {
            if (other.CombinType == CombinSymbol.OrItems) {
                this.Items = this.Items.concat(other.Items);
            }
            else {
                this.Items.push(other);
            }
            return this;
        }
        else {
            return FilterInfo.createOr(this, other);
        }
    }

    public static createOr(...items: FilterInfo[]): FilterInfo {
        return new FilterInfo(null, Operator.Equals, null, CombinSymbol.OrItems, items);
    }
    public static createAnd(...items: FilterInfo[]): FilterInfo {
        return new FilterInfo(null, Operator.Equals, null, CombinSymbol.AndItems, items);
    }

}


export class FilterInfoOf<T> extends FilterInfo {
    constructor(left: DeepKeysOrConstantOrExpression<T> | null, op: Operator | null, right: DeepKeysOrConstantOrExpression<T> | null, combinType: CombinSymbol = CombinSymbol.SingleItem, items: FilterInfo[] = []) {
        super(toValueExp(left), op, toValueExp(right), combinType, items);
    }

    public and(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
        const other = new FilterInfoOf<T>(left, op, right);
        if (this.CombinType == CombinSymbol.AndItems) {
            if (other.CombinType == CombinSymbol.AndItems) {
                this.Items = this.Items.concat(other.Items);
            }
            else {
                this.Items.push(other)
            }
            return this;
        }
        else {
            return new FilterInfoOf<T>(null, null, null, CombinSymbol.AndItems, [this, other]);
        }
    }
    public or(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
        const other = new FilterInfoOf<T>(left, op, right);
        if (this.CombinType == CombinSymbol.OrItems) {
            if (other.CombinType == CombinSymbol.OrItems) {
                this.Items = this.Items.concat(other.Items);
            }
            else {
                this.Items.push(other);
            }
            return this;
        }
        else {
            return new FilterInfoOf<T>(null, null, null, CombinSymbol.OrItems, [this, other]);
        }
    }
}

export function filter<T>(left: DeepKeysOrConstantOrExpression<T>, op: Operator, right: DeepKeysOrConstantOrExpression<T>): FilterInfoOf<T> {
    return new FilterInfoOf<T>(left, op, right);
}
