import { PagedList, AggResult, PageReq } from "./pagedlist";
import { filter, FilterInfo, Operator } from "./filter";
import { con } from "./constant";
import { AggInfo, AggType, agg } from "./agg";
import { queryConfig } from "./default";
import { SelectInfo } from "./select";
import { OrderByInfo } from "./orderby";
import { DeepKeys } from "./type";
import { DataOverflowError } from "./errors";
export type PageFunc<T> = (req: PageReq, signal?: AbortSignal) => Promise<PagedList<T>>;

export interface IdEntity {
    id?: string | number
}


export async function findBy<T>(func: PageFunc<T>, key: keyof T, val: string | number | boolean | bigint, signal?: AbortSignal): Promise<T | null> {
    const res = await func({
        limit: 1,
        offset: 0,
        filter: filter<T>(key, Operator.Equals, con(val)).toString(),
        countAll: false,
    }, signal);
    if (res.items.length > 0) {
        return res.items[0];
    } else {
        return null;
    }
}

export async function findById<T extends IdEntity>(func: PageFunc<T>, id: number | string, signal?: AbortSignal): Promise<T | null> {
    return findBy(func, "id", id, signal);
}
export async function count<T>(func: PageFunc<T>, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        countAll: true,
    }, signal);
    return res.totalCount ?? 0;
}
export async function distinctCount<T>(func: PageFunc<T>, select: SelectInfo | string, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        select: select.toString(),
        distinct: true,
        countAll: true,
    }, signal);
    return res.totalCount ?? 0;
}
//
export async function distinctList<T>(func: PageFunc<T>, arg: { select: SelectInfo | string, filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, maxPageSize?: number, throwIfOverflow?: boolean }, signal?: AbortSignal): Promise<T[]> {
    const res = await func({
        limit: arg.maxPageSize ?? queryConfig.maxLimit,
        offset: 0,
        filter: arg.filter?.toString(),
        select: arg.select.toString(),
        orderBy: arg.orderBy?.toString(),
        distinct: true,
        countAll: false,
    }, signal);
    if (res.hasNext && (arg.throwIfOverflow ?? true)) {
        throw new DataOverflowError(`The result data of distinctList is lost. Total: ${res.totalCount ?? 0}, Max page size: ${res.limit}`);
    }
    return res.items;
}
export async function asList<T>(func: PageFunc<T>, arg?: { filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, select?: SelectInfo | string | null, maxPageSize?: number, throwIfOverflow?: boolean }, signal?: AbortSignal): Promise<T[]> {
    const res = await func({
        limit: arg?.maxPageSize ?? queryConfig.maxLimit,
        offset: 0,
        filter: arg?.filter?.toString(),
        select: arg?.select?.toString(),
        orderBy: arg?.orderBy?.toString(),
        countAll: false,
    }, signal);
    if (res.hasNext && (arg?.throwIfOverflow ?? true)) {
        throw new DataOverflowError(`The result data of asList is lost. Total: ${res.totalCount ?? 0}, Max page size: ${res.limit}`);
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
    distinct?: boolean,
    countAll?: boolean,
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
        countAll: arg.countAll,
    });
}

export async function loadAll<T>(func: PageFunc<T>, arg?: { filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, select?: SelectInfo | string | null, distinct?: boolean, maxPageSize?: number }, signal?: AbortSignal): Promise<T[]> {
    let resArray: T[] = [];
    let offset = 0;
    const args = {
        limit: arg?.maxPageSize ?? queryConfig.maxLimit,
        filter: arg?.filter?.toString(),
        select: arg?.select?.toString(),
        orderBy: arg?.orderBy?.toString(),
        distinct: arg?.distinct ?? false,
        countAll: false,
    }
    while (true) {
        if (signal?.aborted) {
            break;
        }
        const res = await func({
            ...args,
            offset: offset,
        }, signal);
        resArray = resArray.concat(res.items);
        offset += args.limit;
        if (res.items.length == 0 || !res.hasNext || signal?.aborted) {
            break;
        }
    }
    return resArray;
}
export async function aggValue<T>(func: PageFunc<T>, agg: AggInfo | string, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<AggResult> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        agg: agg.toString(),
        countAll: false,
    }, signal);
    return res.aggs as AggResult;
}
export async function aggProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, aggType: AggType = AggType.Sum, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    const tempAggKey = "__tg0";
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        agg: agg(prop, aggType, tempAggKey, filter).toString(),
        countAll: false,
    }, signal);
    return Number(res.aggs?.[tempAggKey])
}
export async function sumProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    return aggProp(func, prop, AggType.Sum, filter, signal);
}
export async function maxProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    return aggProp(func, prop, AggType.Max, filter, signal);
}
export async function minProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    return aggProp(func, prop, AggType.Min, filter, signal);
}
export async function avgProp<T>(func: PageFunc<T>, prop: DeepKeys<T>, filter?: FilterInfo | string | null, signal?: AbortSignal): Promise<number> {
    return aggProp(func, prop, AggType.Avg, filter, signal);
}
