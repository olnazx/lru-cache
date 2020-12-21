LRU Cache.

## Installation

```sh
npm i @olnazx/lru-cache@github:olnazx/lru-cache
```

## Example

```js
const LRUCache = require('@olnazx/lru-cache');
const cache = new LRUCache({ ttl: 10 });

cache.set('key', 'value');
cache.get('key'); // => 'value'
cache.clear();
```

## API Reference

### Constructor

#### `new LRUCache(options)`

Creates a new instance of `LRUCache`. Available options are described below.

##### `max`: Number

Maximum size of cache.

  * Default: `500`

##### `ttl`: Number

Key time-to-live in seconds.

  * Default: `3600`

### Methods

#### `get(key)`

  * `key`: String

#### `set(key, value)`

  * `key`: String
  * `value`: Any

#### `clear()`
