[![Build Status](https://travis-ci.org/Tyler-Murphy/expiring-map.svg?branch=master)](https://travis-ci.org/Tyler-Murphy/expiring-map)

### Install

```
npm install --save expiring_map
```

### Use

Provide an expiration time, in milliseconds, to the constructor. Expiration times can also be provided for each `set` call. If there's no expiration time, the entry will never expire.

```js
const ExpiringMap = require('expiring_map').ExpiringMap

let map = new ExpiringMap(3000)
map.set(1, 1)  // will expire after 3 seconds
map.set(2, 2, 1000)  // will expire after 1 second

let map2 = new ExpiringMap()
map2.set(1, 1)  // will never expire
```
