import { query, Operator, con, AggType } from "../src";
interface User {
    name: string;
    age: number;
    email?: string; // 可选属性
    address: {
        city: string;
        street: string
    }
}


const base = {
    limit: 10,
    offset: 0
}
describe("query", () => {
    describe("any type", () => {

        describe("filter", () => {
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
        describe("select", () => {
            test("single item", () => {
                const req = query<any>().include("name").build();
                expect(req).toStrictEqual({
                    ...base,
                    "select": "name"
                });
            })
            test("two items", () => {
                const req = query<any>().include("name", "age").exclude("email").build();
                expect(req).toStrictEqual({
                    ...base,
                    "select": "name,age,-email"
                });
            })
        })
        describe("agg", () => {
            test("single item", () => {
                const req = query<any>().agg("name", AggType.DistinctCount).build();
                expect(req).toStrictEqual({
                    ...base,
                    "agg": "name.distinctcount()"
                });
            })
            test("two items", () => {
                const req = query<any>()
                    .agg("name", AggType.DistinctCount)
                    .agg("age", AggType.Max, "maxAge")
                    .build();
                expect(req).toStrictEqual({
                    ...base,
                    "agg": "name.distinctcount(),age.max().as(maxAge)"
                });
            })
        })
        describe("limit", () => {
            test("limit", () => {
                const req = query<any>().limit(5).build();
                expect(req).toStrictEqual({
                    ...base,
                    limit: 5
                });
            })
            test("offset", () => {
                const req = query<any>().offset(5).build();
                expect(req).toStrictEqual({
                    ...base,
                    offset: 5
                });
            })
            test("offset with limit", () => {
                const req = query<any>().offset(5).limit(20).build();
                expect(req).toStrictEqual({
                    ...base,
                    offset: 5,
                    limit: 20
                });
            })
        })
        describe("all", () => {
            test("all in one", () => {
                const req = query<any>().where("name", Operator.NotEquals, con("val"))
                    .where("age", Operator.GreaterThan, con(3))
                    .orderby("age")
                    .thenbyDesc("email")
                    .include("[all]")
                    .exclude("address")
                    .agg("name", AggType.Max)
                    .agg("age", AggType.Avg, "avgAge")
                    .offset(5).limit(20).build();
                expect(req).toStrictEqual({
                    filter: '(name != "val") and (age > 3)',
                    orderBy: 'age.asc(),email.desc()',
                    select: '[all],-address',
                    agg: 'name.max(),age.avg().as(avgAge)',
                    offset: 5,
                    limit: 20
                });
            });
        })
    })
    describe("strong type", () => {
        describe("filter", () => {
            test("single item", () => {
                const req = query<User>().where("age", Operator.Equals, con(1)).build();
                expect(req).toStrictEqual({
                    ...base,
                    "filter": "age == 1"
                });
            })
            test("two items", () => {
                const req = query<User>()
                    .where("age", Operator.Equals, con(1))
                    .where("name", Operator.Between, con([null, 'abc']))
                    .build();
                expect(req).toStrictEqual({
                    ...base,
                    "filter": "(age == 1) and (name between [null,\"abc\"])"
                });
            })
        })

        describe("order by", () => {
            test("single item", () => {
                const req = query<User>().orderby("age").build();
                expect(req).toStrictEqual({
                    ...base,
                    "orderBy": "age.asc()"
                });
            })
            test("two items", () => {
                const req = query<User>().orderby("age").thenbyDesc("name").build();
                expect(req).toStrictEqual({
                    ...base,
                    "orderBy": "age.asc(),name.desc()"
                });
            })
        })
        describe("select", () => {
            test("single item", () => {
                const req = query<User>().include("name").build();
                expect(req).toStrictEqual({
                    ...base,
                    "select": "name"
                });
            })
            test("two items", () => {
                const req = query<User>().include("name", "age").exclude("email").build();
                expect(req).toStrictEqual({
                    ...base,
                    "select": "name,age,-email"
                });
            })
        })
        describe("agg", () => {
            test("single item", () => {
                const req = query<User>().agg("name", AggType.DistinctCount).build();
                expect(req).toStrictEqual({
                    ...base,
                    "agg": "name.distinctcount()"
                });
            })
            test("two items", () => {
                const req = query<User>()
                    .agg("name", AggType.DistinctCount)
                    .agg("age", AggType.Max, "maxAge")
                    .build();
                expect(req).toStrictEqual({
                    ...base,
                    "agg": "name.distinctcount(),age.max().as(maxAge)"
                });
            })
        })
        describe("limit", () => {
            test("limit", () => {
                const req = query<User>().limit(5).build();
                expect(req).toStrictEqual({
                    ...base,
                    limit: 5
                });
            })
            test("offset", () => {
                const req = query<User>().offset(5).build();
                expect(req).toStrictEqual({
                    ...base,
                    offset: 5
                });
            })
            test("offset with limit", () => {
                const req = query<User>().offset(5).limit(20).build();
                expect(req).toStrictEqual({
                    ...base,
                    offset: 5,
                    limit: 20
                });
            })
        })
        describe("all", () => {
            test("all in one", () => {
                const req = query<User>().where("name", Operator.NotEquals, con("val"))
                    .where("age", Operator.GreaterThan, con(3))
                    .orderby("age")
                    .thenbyDesc("email")
                    .include("[all]")
                    .exclude("address")
                    .agg("name", AggType.Max)
                    .agg("age", AggType.Avg, "avgAge")
                    .offset(5).limit(20).build();
                expect(req).toStrictEqual({
                    filter: '(name != "val") and (age > 3)',
                    orderBy: 'age.asc(),email.desc()',
                    select: '[all],-address',
                    agg: 'name.max(),age.avg().as(avgAge)',
                    offset: 5,
                    limit: 20
                });
            });
        })
    })
})