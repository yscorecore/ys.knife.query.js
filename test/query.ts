import { QueryBuilder as QB, Query, query } from "../src/query";
import { PagedList } from "../src/pagedlist";
import { FilterInfo } from "../src/filter";
import { OrderByInfo, OrderByType } from "../src/orderby";
import { key } from "../src/type";
import { Operator } from "../src/filter";
import { con } from "../src/constant";
import { AggType } from "../src/agg";

interface User {
    name: string;
    age: number;
    email?: string; // 可选属性
    address: {
        city: string;
        street: string
    }
}

async function fetchUser(query: Query): Promise<PagedList<User>> {
    return {
        limit: 10,
        offset: 0,
        hasNext: false,
        totalCount: 5,
        agg: {},
        items: [
            {
                name: 'zhangsan',
                age: 10,
                address: {
                    city: 'xian',
                    street: 'yanta'
                }
            }
        ]
    };
}
const q = query<User>()
    .where("address", Operator.Equals, con(2))
    .where("address.city", Operator.Between, con("xian"))
    .orderby("name", OrderByType.Desc)
    .agg("age", AggType.Sum)
    .thenby("address.city")
    .include("[all]")
    .exclude("email")
    .limit(0)
    .offset(10)
    .build();

