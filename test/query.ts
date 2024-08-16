import { QueryBuilder as QB, query } from "../src/query";
import { PagedList, PageReq } from "../src/pagedlist";
import { Operator } from "../src/filter";
import { con } from "../src/constant";
import { AggType } from "../src/agg";
import { OrderByType } from "../src/orderby";

interface User {
    name: string;
    age: number;
    email?: string; // 可选属性
    address: {
        city: string;
        street: string
    }
}

// async function fetchUser(query: PageReq): Promise<PagedList<User>> {
//     return {
//         limit: 10,
//         offset: 0,
//         hasNext: false,
//         totalCount: 5,
//         agg: {},
//         items: [
//             {
//                 name: 'zhangsan',
//                 age: 10,
//                 address: {
//                     city: 'xian',
//                     street: 'yanta'
//                 }
//             }
//         ]
//     };
// }
// const q = query<User>()
//     .where("address", Operator.Equals, con(2))
//     .where("address.city", Operator.Between, con("xian"))
//     .orderby("name", OrderByType.Desc)
//     .agg("age", AggType.Sum)
//     .thenby("address.city")
//     .include("[all]")
//     .exclude("email")
//     .limit(0)
//     .offset(10)
//     .build();
const base = {
    limit: 10,
    offset: 0
}
describe("query", () => {
    describe("any type", () => {

        describe("where", () => {
            test("single item", () => {
                const req = query<any>().where("abc", Operator.Equals, con(1)).build();
                expect(req).toStrictEqual({
                    ...base,
                    "filter": "abc == 1"
                });
            })
            test("two items", () => {
                const req = query<any>()
                    .where("abc", Operator.Equals, con(1))
                    .where("bcd", Operator.Between, con([null, 'abc']))
                    .build();
                expect(req).toStrictEqual({
                    ...base,
                    "filter": "(abc == 1) and (bcd between [null,\"abc\"])"
                });
            })
        })

        describe("order by", () => {
            test("single item", () => {
                const req = query<any>().orderby("abc").build();
                expect(req).toStrictEqual({
                    ...base,
                    "orderBy": "abc.asc()"
                });
            })
            test("two items", () => {
                const req = query<any>().orderby("abc").thenbyDesc("bcd").build();
                expect(req).toStrictEqual({
                    ...base,
                    "orderBy": "abc.asc(),bcd.desc()"
                });
            })
        })
    })
    describe("strong type", () => {

    })
})