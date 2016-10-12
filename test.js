const assert = require('assert')
const ExpiringMap = require('./expiring_map.js').ExpiringMap

let tests = []

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

assert.expired = function (map, key) {
  return assert.ok(!map.has(key), 'entries do not exist after expiration')
}

assert.notExpired = function (map, key) {
  return assert.ok(map.has(key), 'entries still exist before expiration')
}

// Entries without expiration never expire
tests.push((() => {
  let map = new ExpiringMap()

  map.set(1, 1)

  return delay(5)
  .then(() => assert.notExpired(map, 1))
})())

// Entries with entry-specific expiration expire, but entries without never do
// for maps without a default expiration time
tests.push((() => {
  let map = new ExpiringMap()
  let expiration = 100

  map.set(1, 1, expiration)
  map.set(2, 2)

  return delay(0)
  .then(() => assert.notExpired(map, 1))
  .then(() => delay(expiration * 2))
  .then(() => {
    assert.expired(map, 1)
    assert.notExpired(map, 2)
  })
})())

// Entries can have a custom expiration time in a map with a default
tests.push((() => {
  let expiration = 100
  let map = new ExpiringMap(expiration)

  map.set(1, 1)
  map.set(2, 2, expiration * 2)

  return delay(0)
  .then(() => {
    assert.notExpired(map, 1)
    assert.notExpired(map, 2)
  })
  .then(() => delay(expiration * 1.5))
  .then(() => {
    assert.expired(map, 1)
    assert.notExpired(map, 2)
  })
  .then(() => delay(expiration * 1.5))
  .then(() => assert.expired(map, 2))
})())

// Entries with an expiration that are deleted and replaced by a new entry with
// the same key but no expiration are never removed in maps without a default
tests.push((() => {
  let expiration = 100
  let map = new ExpiringMap()

  map.set(1, 1, expiration)

  return delay(0)
  .then(() => {
    map.delete(1)
    map.set(1, 1)
  })
  .then(() => delay(expiration * 2))
  .then(() => assert.notExpired(map, 1))
})())

// Entries with an expiration that are deleted by clearing the map and then
// replaced by a new entry with the same key but no expiration are never
// removed in maps without a default
tests.push((() => {
  let expiration = 100
  let map = new ExpiringMap()

  map.set(1, 1, expiration)

  return delay(0)
  .then(() => {
    map.clear()
    map.set(1, 1)
  })
  .then(() => delay(expiration * 2))
  .then(() => assert.notExpired(map, 1))
})())

Promise.all(tests)
.then(() => console.log('all tests passed'))
.catch(error => {
  console.error(error)
  process.exit(1)
})
.then(process.exit)
