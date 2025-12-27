import { PagedList, AggResult, PageReq } from "./pagedlist";
import { filter, FilterInfo, Operator } from "./filter";
import { con } from "./constant";
import { AggInfo, AggType, agg } from "./agg";
import { queryConfig } from "./default";
import { SelectInfo } from "./select";
import { OrderByInfo } from "./orderby";
import { DeepKeys } from "./type";
import { DataOverflowError } from "./errors";
export type PageFunc<T> = (req: PageReq) => Promise<PagedList<T>>;
export type PageFunc2<T> = (offset?: number, limit?: number, agg?: string | null, filter?: string | null, orderBy?: string | null, select?: string | null, distinct?: boolean) => Promise<PagedList<T>>;

export function $page<T>(func: PageFunc2<T>): PageFunc<T> {
    return (req: PageReq) => func(req.offset, req.limit, req.agg, req.filter, req.orderBy, req.select, req.distinct);
}

export interface IdEntity {
    id?: string | number
}

export async function findBy<T>(func: PageFunc<T>, key: keyof T, val: string | number | boolean | bigint): Promise<T | null> {
    const res = await func({
        limit: 1,
        offset: 0,
        filter: filter<T>(key, Operator.Equals, con(val)).toString(),
    });
    if (res.items.length > 0) {
        return res.items[0];
    } else {
        return null;
    }
}

export async function findById<T extends IdEntity>(func: PageFunc<T>, id: number | string): Promise<T | null> {
    return findBy(func, "id", id);
}
export async function count<T>(func: PageFunc<T>, filter?: FilterInfo | string | null): Promise<number> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
    });
    return res.totalCount;
}
export async function distinctCount<T>(func: PageFunc<T>, select: SelectInfo | string, filter?: FilterInfo | string | null): Promise<number> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        select: select.toString(),
        distinct: true
    });
    return res.totalCount;
}
//
export async function distinctList<T>(func: PageFunc<T>, arg: { select: SelectInfo | string, filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, maxPageSize?: number, throwIfOverflow?: boolean }): Promise<T[]> {
    const res = await func({
        limit: arg.maxPageSize ?? queryConfig.maxLimit,
        offset: 0,
        filter: arg.filter?.toString(),
        select: arg.select.toString(),
        orderBy: arg.orderBy?.toString(),
        distinct: true
    });
    if (res.hasNext && (arg.throwIfOverflow ?? true)) {
        throw new DataOverflowError(`The result data of distinctList is lost. Total: ${res.totalCount}, Max page size: ${res.limit}`);
    }
    return res.items;
}
export async function asList<T>(func: PageFunc<T>, arg?: { filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, select?: SelectInfo | string | null, maxPageSize?: number, throwIfOverflow?: boolean }): Promise<T[]> {
    const res = await func({
        limit: arg?.maxPageSize ?? queryConfig.maxLimit,
        offset: 0,
        filter: arg?.filter?.toString(),
        select: arg?.select?.toString(),
        orderBy: arg?.orderBy?.toString(),
    });
    if (res.hasNext && (arg?.throwIfOverflow ?? true)) {
        throw new DataOverflowError(`The result data of asList is lost. Total: ${res.totalCount}, Max page size: ${res.limit}`);
    }
    return res.items;
}
export function queryPage<T>(func: PageFunc<T>, arg: {
    limit?: number,
    offset?: number,
    filter?: FilterInfo | string | null,
    orderBy?: OrderByInfo | string | null,
    select?: SelectInfo | string | null,
    agg?: AggInfo | string | null,
    distinct?: boolean
}
): Promise<PagedList<T>> {
    return func({
        limit: arg.limit ?? queryConfig.defaultLimit,
        offset: arg.offset ?? 0,
        filter: arg.filter?.toString(),
        select: arg.select?.toString(),
        orderBy: arg.orderBy?.toString(),
        agg: arg.agg?.toString(),
        distinct: arg.distinct,
    });
}

export async function loadAll<T>(func: PageFunc<T>, arg?: { filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, select?: SelectInfo | string | null, distinct?: boolean, maxPageSize?: number }): Promise<T[]> {
    let resArray: T[] = [];
    let offset = 0;
    const args = {
        limit: arg?.maxPageSize ?? queryConfig.maxLimit,
        filter: arg?.filter?.toString(),
        select: arg?.select?.toString(),
        orderBy: arg?.orderBy?.toString(),
        distinct: arg?.distinct ?? false,
    }
    while (true) {
        const res = await func({
            ...args,
            offset: offset,
        });
        resArray = resArray.concat(res.items);
        offset += args.limit;
        if (res.items.length == 0 || !res.hasNext) {
            break;
        }
    }
    return resArray;
}
export async function aggValue<T>(func: PageFunc<T>, agg: AggInfo | string, filter?: FilterInfo | string | null): Promise<AggResult> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        agg: agg.toString()
    });
    return res.aggs as AggResult;
}
export async function aggProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, aggType: AggType = AggType.Sum, filter?: FilterInfo | string | null): Promise<number> {
    const tempAggKey = "__tg0";
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        agg: agg(prop, aggType, tempAggKey).toString()
    });
    return Number(res.aggs?.[tempAggKey])
}
export async function sumProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null): Promise<number> {
    return aggProp(func, prop, AggType.Sum, filter);
}
export async function maxProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null): Promise<number> {
    return aggProp(func, prop, AggType.Max, filter);
}
export async function minProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null): Promise<number> {
    return aggProp(func, prop, AggType.Min, filter);
}
export async function avgProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null): Promise<number> {
    return aggProp(func, prop, AggType.Avg, filter);
}
