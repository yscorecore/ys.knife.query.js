import { AggType, agg } from "../src/agg";

interface User {
    name: string;
    age: number;
    email?: string;
    address: {
        city: string;
        street: string
    } // 可选属性
}

describe("agg", () => {
    describe("any type", () => {
        test("one", () => {
            expect(agg<any>("abc").toString()).toBe("abc.sum()");
        });
        test("one with type", () => {
            expect(agg<any>("abc", AggType.Avg).toString()).toBe("abc.avg()");
        });
        test("one with type and name", () => {
            expect(agg<any>("abc", AggType.Avg, "other").toString()).toBe("abc.avg().as(other)");
        });
        test("two", () => {
            expect(agg<any>("abc", AggType.Avg, "other").append("bcd").toString()).toBe("abc.avg().as(other),bcd.sum()");
        })
    });
    describe("strong type", () => {
        test("one", () => {
            expect(agg<User>("age").toString()).toBe("age.sum()");
        });
        test("one with type", () => {
            expect(agg<User>("age", AggType.Avg).toString()).toBe("age.avg()");
        });
        test("one with type and name", () => {
            expect(agg<User>("age", AggType.Avg, "other").toString()).toBe("age.avg().as(other)");
        });
        test("two", () => {
            expect(agg<User>("age", AggType.Avg, "other").append("address.city", AggType.DistinctCount).toString()).toBe("age.avg().as(other),address.city.distinctcount()");
        })
    });
});