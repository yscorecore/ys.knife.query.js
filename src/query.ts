import { AggInfo } from "./agg";
import { FilterInfo, ValueType } from "./filter";
import { OrderByInfo, OrderByType } from "./orderby";
import { SelectInfo } from "./select";
import { DeepKeys } from "./path";
import config from "./default"
import { Operator } from "./operator";

export interface Query {
    filter?: string | null,
    orderBy?: string | null,
    select?: string | null,
    agg?: string | null,
    limit?: number,
    offset?: number
}

export class QueryBuilder {

    private filterInfo: FilterInfo | undefined;
    private orderByInfo: OrderByInfo | undefined;
    private selectInfo: SelectInfo | undefined;
    private agg: AggInfo | undefined;
    private _limit: number = config.limit;
    private _offset: number = 0;

    public build(): Query {
        return {
            select: this.selectInfo?.toString(),
            filter: this.filterInfo?.toString(),
            orderBy: this.orderByInfo?.toString(),
            agg: this.agg?.toString(),
            limit: this._limit,
            offset: this._offset
        };
    }
    public withAgg(agg: AggInfo): QueryBuilder {
        this.agg = agg;
        return this;
    }
    public withFilter(filter: FilterInfo): QueryBuilder {
        this.filterInfo = filter;
        return this;
    }
    public withOrderBy(orderby: OrderByInfo): QueryBuilder {
        this.orderByInfo = orderby;
        return this;
    }
    public withSelect(select: SelectInfo): QueryBuilder {
        this.selectInfo = select;
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
    public pageSize(pageSize: number): QueryBuilder {
        return this.limit(pageSize);
    }
  

    public static new<T>(): QueryBuilderT<T> {
        return new QueryBuilderT<T>();
    }
}

export class QueryBuilderT<T> extends QueryBuilder {

    public where(path: DeepKeys<T>, value: ValueType, op: Operator = Operator.Equals): QueryBuilderT<T> {
        return this;
    }
    public orderby(path: DeepKeys<T>, type: OrderByType = OrderByType.Asc): QueryBuilderT<T> {
        return this;
    }
}
export function query<T>(){
    return new QueryBuilderT<T>();
}