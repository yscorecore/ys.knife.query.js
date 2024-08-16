import { AggInfo, AggItem, AggType } from "./agg";
import { FilterInfo, Operator } from "./filter";
import { OrderByInfo, OrderByItem, OrderByType } from "./orderby";
import { FieldKeys, SelectInfo, SelectItem } from "./select";
import { DeepKeys, DeepKeysOrConstantOrExpression, DeepKeysOrExpression, toExp, toValueExp } from "./type";
import config from "./default"
import { PageReq } from "./pagedlist";



export class QueryBuilder {

    protected _filterInfo?: FilterInfo;
    protected _orderByInfo?: OrderByInfo;
    protected _selectInfo?: SelectInfo;
    protected _aggInfo?: AggInfo;
    protected _limit: number = config.limit;
    protected _offset: number = 0;

    public build(): PageReq {
        const res: PageReq = {
            limit: this._limit,
            offset: this._offset
        };
        if (this._filterInfo) {
            res.filter = this._filterInfo.toString();
        }
        if (this._orderByInfo) {
            res.orderBy = this._orderByInfo.toString();
        }
        if (this._selectInfo) {
            res.select = this._selectInfo.toString();
        }
        if (this._aggInfo) {
            res.agg = this._aggInfo.toString();
        }
        return res;
    }
    public withAgg(agg: AggInfo): QueryBuilder {
        this._aggInfo = agg;
        return this;
    }
    public withFilter(filter: FilterInfo): QueryBuilder {
        this._filterInfo = filter;
        return this;
    }
    public withOrderBy(orderby: OrderByInfo): QueryBuilder {
        this._orderByInfo = orderby;
        return this;
    }
    public withSelect(select: SelectInfo): QueryBuilder {
        this._selectInfo = select;
        return this;
    }
    public offset(offset: number): QueryBuilder {
        this._offset = offset;
        return this;
    }
    public limit(limit: number): QueryBuilder {
        this._limit = limit;
        return this;
    }
}

export class QueryBuilderOf<T> extends QueryBuilder {

    public where(left: DeepKeysOrConstantOrExpression<T>, op: Operator = Operator.Equals, right: DeepKeysOrConstantOrExpression<T>): QueryBuilderOf<T> {
        if (this._filterInfo) {
            this._filterInfo = this._filterInfo.andAlso(new FilterInfo(toValueExp(left), op, toValueExp(right)));
        } else {
            this._filterInfo = new FilterInfo(toValueExp(left), op, toValueExp(right));
        }
        return this;
    }

    public orderby(path: DeepKeysOrExpression<T>, type: OrderByType = OrderByType.Asc): QueryBuilderOf<T> {
        this._orderByInfo = new OrderByInfo(new OrderByItem(toExp(path), type));
        return this;
    }
    public orderbyDesc(path: DeepKeysOrExpression<T>): QueryBuilderOf<T> {
        return this.orderby(path, OrderByType.Desc);
    }
    public thenby(path: DeepKeysOrExpression<T>, type: OrderByType = OrderByType.Asc): QueryBuilderOf<T> {
        if (this._orderByInfo) {
            this._orderByInfo.add(toExp(path), type);
        } else {
            this._orderByInfo = new OrderByInfo(new OrderByItem(toExp(path), type));
        }
        return this;
    }
    public thenbyDesc(path: DeepKeysOrExpression<T>): QueryBuilderOf<T> {
        return this.thenby(path, OrderByType.Desc);
    }
    public agg(path: DeepKeys<T>, type: AggType = AggType.Sum, name: string | null = null): QueryBuilderOf<T> {
        if (this._aggInfo) {
            this._aggInfo.append(path, type, name);
        } else {
            this._aggInfo = new AggInfo(new AggItem(path, type, name));
        }
        return this;
    }
    public include(...names: FieldKeys<T>[]): QueryBuilderOf<T> {
        if (this._selectInfo) {
            this._selectInfo.appendItems(...names.map(t => new SelectItem(t.toString())));
        } else {
            this._selectInfo = new SelectInfo(...names.map(t => new SelectItem(t.toString())));
        }
        return this;
    }
    public exclude(...names: FieldKeys<T>[]): QueryBuilderOf<T> {
        if (this._selectInfo) {
            this._selectInfo.appendItems(...names.map(t => new SelectItem(t.toString(), true)));
        } else {
            this._selectInfo = new SelectInfo(...names.map(t => new SelectItem(t.toString(), true)));
        }
        return this;
    }
}
export function query<T>() {
    return new QueryBuilderOf<T>();
}