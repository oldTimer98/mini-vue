import { isProxy, isReactive, reactive } from '../reactive'

describe("reactive", () => {
  it("happy path", () => {
    const obj1 = { foo: 1 }
    const obj2 = reactive(obj1)
    expect(obj2).not.toBe(obj1)
    expect(obj2.foo).toBe(1)
    expect(isReactive(obj2)).toBe(true);
    expect(isReactive(obj1)).toBe(false);
    expect(isProxy(obj2)).toBe(true);
  })
  test("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
})
