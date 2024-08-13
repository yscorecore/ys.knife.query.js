import { select } from "../src/select";
import { exp } from "../src/expression";

interface User {
    name: string;
    age: number;
    email?: string;
    address: {
        city: string;
        street: string
    }}

describe("select", () => {
    describe("any type", () => {
        test("one", () => {
            expect(select<any>("age").toString()).toBe("age");
        });
        test("special", () => {
            expect(select<any>("[complex]").toString()).toBe("[complex]");
        });
        test("two", () => {
            expect(select<any>("age","address").toString()).toBe("age,address");
        });
        test("two steps", () => {
            expect(select<any>("age").include("address").toString()).toBe("age,address");
        });
        test("exclude", () => {
            expect(select<any>("[all]").exclude("address").toString()).toBe("[all],-address");
        });
        test("many steps", () => {
            expect(select<any>("[default]").exclude("address").include("[complex]","email").toString()).toBe("[default],-address,[complex],email");
        });
    });
    describe("strong type", () => {
        test("one", () => {
            expect(select<User>("age").toString()).toBe("age");
        });
        test("special", () => {
            expect(select<User>("[complex]").toString()).toBe("[complex]");
        });
        test("two", () => {
            expect(select<User>("age","address").toString()).toBe("age,address");
        });
        test("two steps", () => {
            expect(select<User>("age").include("address").toString()).toBe("age,address");
        });
        test("exclude", () => {
            expect(select<User>("[all]").exclude("address").toString()).toBe("[all],-address");
        });
        test("many steps", () => {
            expect(select<User>("[default]").exclude("address").include("[complex]","email").toString()).toBe("[default],-address,[complex],email");
        });

    });
});