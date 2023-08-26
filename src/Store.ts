export class Store<T> {
  #listeners: (() => void)[];
  getSnapshot: () => T;

  constructor(getSnapshot: () => T) {
    this.#listeners = [];
    this.getSnapshot = getSnapshot;
  }

  subscribe(listener: () => void) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  emitChange() {
    for (const l of this.#listeners) {
      l();
    }
  }
}
