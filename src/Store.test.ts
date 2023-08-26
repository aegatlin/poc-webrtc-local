import { expect, test } from "vitest";
import { Store } from "./Store";

test("Store.getSnapshot", () => {
  let n = 1;
  const store = new Store(() => n);
  expect(store.getSnapshot()).toBe(1);
  n = 5;
  expect(store.getSnapshot()).toBe(5);
});

test("Store.subscribe and Store.emitChange", () => {
  let actual = undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function fakeUseSyncExternalStore(subscribe, getSnapshot) {
    actual = getSnapshot();

    subscribe(() => {
      actual = getSnapshot();
    });
  }

  let data = 0;
  const store = new Store(() => data);

  expect(actual).toBeUndefined();
  fakeUseSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store)
  );

  expect(actual).toBe(0);
  data = 1;
  store.emitChange();
  expect(actual).toBe(1);
});
