'use strict'

class LRUCache {
  /**
   * Constructor.
   * @param {Integer} [max=500] Cache maximum size
   * @param {Integer} [ttl=3600] Key time-to-live (seconds; default is 1 hour)
   */
  constructor ({ max = 500, ttl = 3600 } = {}) {
    this._max = max;
    this._ttl = ttl;

    /**
     * Current size of cache.
     * @type {Integer}
     */
    this._size = 0;

    /**
     * Cache.
     * @type {Map}
     */
    this._cache = new Map();
    this._oldCache = new Map();
  }

  /**
   * Returns an item from a cache.
   * @param {String} key
   * @returns {Any}
   */
  get (key) {
    let value;
    let fromOldCache = false;

    if (this._cache.has(key)) {
      value = this._cache.get(key);
    } else if (this._oldCache.has(key)) {
      value = this._oldCache.get(key);
      fromOldCache = true;
    }

    if (!value) {
      return;
    }

    // Key expired.
    if ((Date.now() - value.t) >= this._ttl * 1000) {
      if (fromOldCache) {
        this._oldCache.delete(key);
      } else {
        this._cache.delete(key);
        this._size -= 1;
      }

      return;
    }

    if (fromOldCache) {
      this._oldCache.delete(key);
      this.set(key, value);
    }

    return value.v;
  }

  /**
   * Puts an item into a cache.
   * @param {String} key
   * @param {Any} v
   * @returns {void}
   */
  set (key, v) {
    const value = {
      v,
      t: Date.now()
    }

    if (this._cache.has(key)) {
      this._cache.set(key, value);

      return;
    }

    this._cache.set(key, value);
    this._size += 1;

    if (this._size >= this._max) {
      this._size = 0;
      this._oldCache = this._cache;
      this._cache = new Map();
    }
  }
}

module.exports = LRUCache;