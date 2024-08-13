export interface PagedList<T> {
    limit: number,
    offset: number,
    totalCount: number,
    hasNext: boolean,
    agg: { [key: string]: number; } | undefined,
    items: T[],
}