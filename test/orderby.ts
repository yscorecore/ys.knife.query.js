import { OrderByType, orderby } from "../src/orderby";
import { exp } from "../src/expression";

interface User {
  name: string;
  age: number;
  email?: string;
  address: {
    city: string;
    street: string
  } // 可选属性
}
describe("order by", () => {
  describe("any type", () => {
    test("one", () => {
      expect(orderby<any>("abc").toString()).toBe("abc.asc()");
    });
    test("one desc", () => {
      expect(orderby<any>("abc", OrderByType.Desc).toString()).toBe("abc.desc()");
    });
    test("then by", () => {
      expect(orderby<any>("abc").then("b.c.d").toString()).toBe("abc.asc(),b.c.d.asc()");
    });
    test("then by desc", () => {
      expect(orderby<any>("abc").thenDesc("b.c.d").toString()).toBe("abc.asc(),b.c.d.desc()");
    });
    test("by function", () => {
      expect(orderby<any>("random()").toString()).toBe("random().asc()");
    });
  });
  describe("strong type", () => {
    test("one", () => {
      expect(orderby<User>("name").toString()).toBe("name.asc()");
    });
    test("one desc", () => {
      expect(orderby<User>("name", OrderByType.Desc).toString()).toBe("name.desc()");
    });
    test("then by", () => {
      expect(orderby<User>("name").then("address.city").toString()).toBe("name.asc(),address.city.asc()");
    });
    test("then by desc", () => {
      expect(orderby<User>("name").thenDesc("address.city").toString()).toBe("name.asc(),address.city.desc()");
    });
    test("by function", () => {
      expect(orderby<User>(exp("random()")).toString()).toBe("random().asc()");

    });
  });

});


