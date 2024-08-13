import { filter, Operator } from "../src/filter";
import { exp } from "../src/expression";
import { con } from "../src/constant";

interface User {
    name: string;
    age: number;
    email?: string;
    address?: {
        city: string;
        street: string
    }
}
describe("filter", () => {
    describe("any type", () => {
        test("one item", () => {
            expect(filter<any>("name", Operator.Equals, con("zhang")).toString()).toBe("name == \"zhang\"");
        });
        test("two items with and", () => {
            expect(
                filter<any>("name", Operator.Equals, con("zhang")).and("age", Operator.NotEquals, con(3)).toString()).toBe("(name == \"zhang\") and (age != 3)");
        });
        test("two items with or", () => {
            expect(
                filter<any>("name", Operator.Equals, con("zhang"))
                    .or("age", Operator.NotEquals, con(3)).toString())
                .toBe("(name == \"zhang\") or (age != 3)");
        });
        test("three items", () => {
            const exp = filter<any>("name", Operator.Equals, con("zhang"))
                .or("age", Operator.NotEquals, con(3))
                .and("address.city", Operator.In, con(["xian"]));
            expect(exp.toString())
                .toBe("((name == \"zhang\") or (age != 3)) and (address.city in [\"xian\"])");
        });
        test("four items", () => {
            const f = filter<any>("name", Operator.Equals, con("zhang"))
                .or("age", Operator.NotEquals, con(3))
                .and("address.city", Operator.In, con(["xian"]))
                .and(exp("address.city.lower()"), Operator.Equals, "address.city");
            expect(f.toString())
                .toBe("((name == \"zhang\") or (age != 3)) and (address.city in [\"xian\"]) and (address.city.lower() == address.city)");
        });
    });
    describe("strong type", () => {
        test("one item", () => {
            expect(filter<User>("name", Operator.Equals, con("zhang")).toString()).toBe("name == \"zhang\"");
        });
        test("two items with and", () => {
            expect(
                filter<User>("name", Operator.Equals, con("zhang")).and("age", Operator.NotEquals, con(3)).toString()).toBe("(name == \"zhang\") and (age != 3)");
        });
        test("two items with or", () => {
            expect(
                filter<User>("name", Operator.Equals, con("zhang"))
                    .or("age", Operator.NotEquals, con(3)).toString())
                .toBe("(name == \"zhang\") or (age != 3)");
        });
        test("three items", () => {
            const exp = filter<User>("name", Operator.Equals, con("zhang"))
                .or("age", Operator.NotEquals, con(3))
                .and("address.city", Operator.In, con(["xian"]));
            expect(exp.toString())
                .toBe("((name == \"zhang\") or (age != 3)) and (address.city in [\"xian\"])");
        });
        test("four items", () => {
            const f = filter<User>("name", Operator.Equals, con("zhang"))
                .or("age", Operator.NotEquals, con(3))
                .and("address.city", Operator.In, con(["xian"]))
                .and(exp("address.city.lower()"), Operator.Equals, "address.city");
            expect(f.toString())
                .toBe("((name == \"zhang\") or (age != 3)) and (address.city in [\"xian\"]) and (address.city.lower() == address.city)");
        });
    });

    describe("operators",()=>{
        test("equals", () => {
            expect(filter<any>("val", Operator.Equals, con("val1")).toString()).toBe("val == \"val1\"");
        });
        test("not equals", () => {
            expect(filter<any>("val", Operator.NotEquals, con("val1")).toString()).toBe("val != \"val1\"");
        });
        test("greater than", () => {
            expect(filter<any>("val", Operator.GreaterThan, con("val1")).toString()).toBe("val > \"val1\"");
        });
        test("greater than or equal", () => {
            expect(filter<any>("val", Operator.GreaterThanOrEqual, con("val1")).toString()).toBe("val >= \"val1\"");
        });
        test("less than", () => {
            expect(filter<any>("val", Operator.LessThan, con("val1")).toString()).toBe("val < \"val1\"");
        });
        test("less than or equal", () => {
            expect(filter<any>("val", Operator.LessThanOrEqual, con("val1")).toString()).toBe("val <= \"val1\"");
        });
        test("starts with", () => {
            expect(filter<any>("val", Operator.StartsWith, con("val1")).toString()).toBe("val starts \"val1\"");
        });
        test("not starts with", () => {
            expect(filter<any>("val", Operator.NotStartsWith, con("val1")).toString()).toBe("val not starts \"val1\"");
        });
        test("ends with", () => {
            expect(filter<any>("val", Operator.EndsWith, con("val1")).toString()).toBe("val ends \"val1\"");
        });

        test("not ends with", () => {
            expect(filter<any>("val", Operator.NotEndsWith, con("val1")).toString()).toBe("val not ends \"val1\"");
        });

        test("contains", () => {
            expect(filter<any>("val", Operator.Contains, con("val1")).toString()).toBe("val contains \"val1\"");
        });
        test("not contains", () => {
            expect(filter<any>("val", Operator.NotContains, con("val1")).toString()).toBe("val not contains \"val1\"");
        });

        test("in", () => {
            expect(filter<any>("val", Operator.In, con(["val1"])).toString()).toBe("val in [\"val1\"]");
        });

        test("not in", () => {
            expect(filter<any>("val", Operator.NotIn, con(["val1"])).toString()).toBe("val not in [\"val1\"]");
        });

        test("between", () => {
            expect(filter<any>("val", Operator.Between, con(["val1",null])).toString()).toBe("val between [\"val1\",null]");
        });

        test("not between", () => {
            expect(filter<any>("val", Operator.NotBetween, con(["val1",null])).toString()).toBe("val not between [\"val1\",null]");
        });
    });
});