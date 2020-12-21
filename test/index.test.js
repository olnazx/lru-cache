'use strict';

const LRUCache = require('../src');

test('it exports a Cache constructor', () => {
  expect(typeof LRUCache).toBe('function');
});

describe('LRUCache', () => {
  describe('constructor', () => {
    test('it should initialize correctly', () => {
      const lru = new LRUCache();

      expect(lru._max).toBe(500);
      expect(lru._ttl).toBe(3600);
      expect(lru._size).toBe(0);
      expect(lru._cache).toBeInstanceOf(Map);
      expect(lru._oldCache).toBeInstanceOf(Map);
    });

    test('it should accept custom "max" and "ttl"', () => {
      const lru = new LRUCache({ max: 100, ttl: 10 });

      expect(lru._max).toBe(100);
      expect(lru._ttl).toBe(10);
    });
  });

  describe('get(), set()', () => {
    test('does set() and get()', () => {
      const cache = new LRUCache();

      cache.set('key', 'value');
      expect(cache.get('key')).toBe('value');
      expect(cache._size).toBe(1);

      cache.set('key', 'value_new');
      expect(cache.get('key')).toBe('value_new');
      expect(cache._size).toBe(1);

      cache.set('key2', 'value2');
      expect(cache.get('key2')).toBe('value2');
      expect(cache._size).toBe(2);

      expect(cache.get('key3')).not.toBeDefined();
    });

    test('lru-cache algorithm should work as expected with "max" parameter', () => {
      const cache = new LRUCache({ max: 2 });

      expect(cache._max).toBe(2);

      cache.set('key', 'value');
      expect(cache._size).toBe(1);
      expect(cache._cache.size).toBe(1);
      expect(cache._oldCache.size).toBe(0);

      cache.set('key2', 'value2');
      expect(cache._size).toBe(0);
      expect(cache._cache.size).toBe(0);
      expect(cache._oldCache.size).toBe(2);

      expect(cache.get('key2')).toBe('value2');
      expect(cache._size).toBe(1);
      expect(cache._cache.size).toBe(1);
      expect(cache._oldCache.size).toBe(1);
    });

    test('it updates "value.t" value (timestamp) when value gets updated', () => {
      const cache = new LRUCache();

      cache.set('key', 'value');

      const firstSetAt = Date.now();

      expect(cache._cache.get('key').t).toBeLessThanOrEqual(firstSetAt);

      cache.set('key', 'value');

      expect(cache._cache.get('key').t).toBeGreaterThanOrEqual(firstSetAt);
    });

    test('it deletes value from cache if it has expired', async () => {
      const cache = new LRUCache({ ttl: 1 });

      cache.set('key', 'value');

      expect(cache._size).toBe(1);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const value = cache.get('key');

      expect(value).not.toBeDefined();
      expect(cache._cache.size).toBe(0);
      expect(cache._size).toBe(0);
    });

    test('it should not change ._cache size if item expired from ._oldCache', async () => {
      const cache = new LRUCache({ max: 1, ttl: 1 });

      cache.set('key', 'value');

      // because of "max: 1", item is automatically moved to ._oldCache
      expect(cache._size).toBe(0);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const value = cache.get('key');

      expect(value).not.toBeDefined();
      expect(cache._oldCache.size).toBe(0);
      expect(cache._size).toBe(0);
    });
  });

  describe('clear()', () => {
    test('it removes all items from a cache', () => {
      const cache = new LRUCache();

      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      expect(cache._size).toBe(2);

      cache.clear();

      expect(cache.get('key1')).toBe(undefined);
      expect(cache.get('key2')).toBe(undefined);
      expect(cache._size).toBe(0);
    });
  });
});
