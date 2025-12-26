import { asList, loadAll, count, findBy, findById, PageReq, PagedList, query, filter, con, Operator, agg, aggValue } from "../src";

interface User {
    id: number;
    name: string;
    age: number;
    email?: string; // 可选属性
    address: {
        city: string;
        street: string
    }
}
const userList: User[] = [
    {
        id: 1,
        name: "san",
        age: 10,
        email: "abc@qq.com",
        address: {
            city: "xian",
            street: "street1"
        }
    },
    {
        id: 2,
        name: "si",
        age: 13,
        address: {
            city: "xian",
            street: "street2"
        }
    },
    {
        id: 3,
        name: "wu",
        age: 11,
        address: {
            city: "beijing",
            street: "street3"
        }
    }
];
function queryUser(req: PageReq): Promise<PagedList<User>> {
    let val: PagedList<User> = {
        limit: req.limit ?? 0,
        offset: req.offset ?? 0,
        hasNext: (req.offset ?? 0) + (req.limit ?? 0) < userList.length,
        items: userList.slice(req.offset ?? 0, (req.offset ?? 0) + (req.limit ?? 0)),
        totalCount: userList.length,
        aggs: {}
    }
    return Promise.resolve(val);
}

describe("api", () => {
    describe("any type", () => {
        test("count", async () => {
            let res = await count(queryUser, filter<any>(con(1), Operator.Equals, con(1)).toString());
            expect(res).toBe(3);
        })
        test("asList", async () => {
            let res = await asList(queryUser);
            expect(res.length).toBe(3);
        })
        test("loadAll", async () => {
            let res = await loadAll(queryUser, query<any>().build(), 1);    
            expect(res.length).toBe(3);
        })
        test("findBy", async () => {
            let res = await findBy(queryUser, "name", '1');
            expect(res).toBeDefined();
        });
        test("findById", async () => {
            let res = await findById(queryUser, "1");
            expect(res).toBeDefined();
        });
        test("agg", async () => {
            let res = await aggValue(queryUser, agg("age"), null);
            expect(res).toStrictEqual({});
        });
    })
    describe("strong type", () => {

        test("count", async () => {
            let res = await count(queryUser, filter<User>(con(1), Operator.Equals, con(1)));
            expect(res).toBe(3);
        })
        test("asList", async () => {
            let res = await asList(queryUser);
            expect(res.length).toBe(3);
        })
        test("loadAll", async () => {
            let res = await loadAll(queryUser, query<User>().build(), 1);    
            expect(res.length).toBe(3);
        })
        test("findBy", async () => {
            let res = await findBy(queryUser, "name", '1');
            expect(res).toBeDefined();
        });
        test("findById", async () => {
            let res = await findById(queryUser, "1");
            expect(res).toBeDefined();
        });
        test("agg", async () => {
            let res = await aggValue(queryUser, agg("age"), null);
            expect(res).toStrictEqual({});
        });
    })
})