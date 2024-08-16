export interface AggResult {
    [key: string]: number | string | null; // 索引签名的类型是 string，值类型是 number
}
export interface PagedList<T> {
    limit: number,
    offset: number,
    totalCount: number,
    hasNext: boolean,
    agg: AggResult | undefined,
    items: T[],
}
export interface ListReq {
    filter?: string | null,
    orderBy?: string | null,
    select?: string | null,
    limit?: number,
    offset?: number
}
export interface PageReq extends ListReq {
    agg?: string | null;
}
