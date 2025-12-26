import { PagedList, AggResult, BaseReq } from "./pagedlist";
import { ListReq, PageReq } from "./pagedlist";
import { filter, FilterInfo, Operator } from "./filter";
import { con } from "./constant";
import { AggInfo } from "./agg";
import config from "./default";

type PageFunc<T> = (req: PageReq) => Promise<PagedList<T>>;
type PageFunc2<T> = (offset?: number, limit?: number, agg?: string | null, filter?: string | null, orderBy?: string | null, select?: string | null, distinct?: boolean) => Promise<PagedList<T>>;

export function $page<T>(func: PageFunc2<T>): PageFunc<T> {
    return (req: PageReq) => func(req.offset, req.limit, req.agg, req.filter, req.orderBy, req.select, req.distinct);
}

export interface IdEntity {
    id: string | number
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
export async function count<T>(func: PageFunc<T>, filter: FilterInfo): Promise<number> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
    });
    return res.totalCount;
}
export async function asList<T>(func: PageFunc<T>, listReq: ListReq): Promise<T[]> {
    const res = await func(listReq);
    return res.items;
}
export async function all<T>(func: PageFunc<T>, baseReq: BaseReq, maxPageSize: number = config.maxLimit): Promise<T[]> {
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
export async function aggValue<T>(func: PageFunc<T>, agg: AggInfo, filter: FilterInfo | null): Promise<AggResult> {
    const res = await func({
        limit: 0,
        offset: 0,
        filter: filter?.toString(),
        agg: agg.toString()
    });
    return res.agg as AggResult;
}