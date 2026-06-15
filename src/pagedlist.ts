export interface AggResult {
    [key: string]: number | string | null; // 索引签名的类型是 string，值类型是 number
}
export interface PagedList<T> {
    limit: number,
    offset: number,
    totalCount?: number | null,
    hasNext: boolean,
    aggs?: AggResult | null,
    items: T[],
}
export interface BaseReq {
    filter?: string,
    orderBy?: string,
    select?: string,
    distinct?: boolean,
    countAll?: boolean,
}
export interface ListReq extends BaseReq {
    limit?: number,
    offset?: number
}
export interface PageReq extends ListReq {
    agg?: string,
}