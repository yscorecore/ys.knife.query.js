import { PagedList, AggResult, BaseReq ,PageReq} from "./pagedlist";
import { filter, FilterInfo, Operator } from "./filter";
import { con } from "./constant";
import { AggInfo, AggType, agg } from "./agg";
import config from "./default";
import { SelectInfo } from "./select";
import { OrderByInfo } from "./orderby";
import { DeepKeys } from "./type";

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
export async function distinctList<T>(func: PageFunc<T>, select: SelectInfo | string, filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, maxPageSize: number = config.maxLimit, throwIfOverflow: boolean = true): Promise<T[]> {
    const res = await func({
        limit: maxPageSize,
        offset: 0,
        filter: filter?.toString(),
        select: select.toString(),
        orderBy: orderBy?.toString(),
        distinct: true
    });
    if (res.hasNext && throwIfOverflow) {
        throw new Error("hasNext is true, distinctList will lose data.");
    }
    return res.items;
}
export async function asList<T>(func: PageFunc<T>, filter?: FilterInfo | string | null, orderBy?: OrderByInfo | string | null, select?: SelectInfo | string | null, maxPageSize: number = config.defaultLimit, throwIfOverflow: boolean = true): Promise<T[]> {
    const res = await func({
        limit: maxPageSize,
        offset: 0,
        filter: filter?.toString(),
        select: select?.toString(),
        orderBy: orderBy?.toString(),
    });
    if (res.hasNext && throwIfOverflow) {
        throw new Error("hasNext is true, asList will lose data.");
    }
    return res.items;
}

export async function loadAll<T>(func: PageFunc<T>, baseReq: BaseReq, maxPageSize: number = config.maxLimit): Promise<T[]> {
    let resArray: T[] = [];
    let offset = 0;

    while (true) {
        const res = await func({
            ...baseReq,
            limit: maxPageSize,
            offset: offset,
        });
        resArray = resArray.concat(res.items);
        offset += maxPageSize;
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
