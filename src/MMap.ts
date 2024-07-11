export default class MMap<K, V> {
  entries: Map<string, V> = new Map();
  public size = this.entries.size;

  set(key: K, value: V) {
    const sKey = JSON.stringify(key);
    this.entries.set(sKey, value);
  }

  has(key: K) {
    const sKey = JSON.stringify(key);
    return this.entries.has(sKey);
  }

  get(key: K) {
    const sKey = JSON.stringify(key);
    return this.entries.get(sKey);
  }
}
