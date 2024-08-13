import { OrderByInfo, OrderByItem, OrderByType } from "../src/orderby";
import { path } from "../src/path";

interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
}

test('order by', () => {
  expect(OrderByInfo.create("a").toString()).toBe("a.asc()");
});


test('order by', () => {
  expect(OrderByInfo.create(path<User>("age")).toString()).toBe("age.asc()");
});



