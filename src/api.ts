import { PagedList } from "./pagedlist";
import { ListReq, Query } from "./query";
import { filter, FilterInfo, Operator } from "./filter"
import { con } from "./constant";
import { AggInfo } from "./agg";

type PageFunc<T> = (req: Query) => Promise<PagedList<T>>;
type ListFunc<T> = (req: ListReq) => Promise<T[]>;

interface IdEntity {
    id: string | number
}

export async function findBy<T>(func: PageFunc<T>, key: keyof T, val: any): Promise<T | null> {
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
        limit: 1,
        offset: 0,
        filter: filter?.toString(),
    });
    return res.totalCount;
}
export async function asList<T>(func: PageFunc<T>): Promise<T[]> {
    const res = await func({
        limit: 1,
        offset: 0,
        filter: null,
    });
    return res.items;
}
export async function agg<T>(func: PageFunc<T>, agg: AggInfo): Promise<any> {
    return null
}