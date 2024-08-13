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

});