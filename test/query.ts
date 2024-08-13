import { QueryBuilder as QB, Query ,query} from "../src/query";
import { PagedList } from "../src/pagedlist";
import { FilterInfo } from "../src/filter";
import { OrderByInfo } from "../src/orderby";
import {key} from "../src/type";
import { Operator } from "../src/filter";

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

