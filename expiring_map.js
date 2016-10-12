class ExpiringMap extends Map {
  constructor (defaultTimeoutMs) {
    super()
    this.defaultTimeoutMs = defaultTimeoutMs
    this.pendingTimeouts = new Map()
  }

  set (key, value, timeoutMs) {
    let timeout = timeoutMs || this.defaultTimeoutMs

    if (timeout) {
      this.pendingTimeouts.set(
        key,
        setTimeout(() => super.delete(key), timeout)
      )
    }

    return super.set(key, value)
  }

  delete (key) {
    let pendingTimeout = this.pendingTimeouts.get(key)

    if (pendingTimeout) {
      clearTimeout(pendingTimeout)
      this.pendingTimeouts.delete(key)
    }

    super.delete(key)
  }

  clear () {
    for (let timeout of this.pendingTimeouts.values()) {
      clearTimeout(timeout)
    }

    this.pendingTimeouts.clear()
    super.clear()
  }
}

module.exports = {
  ExpiringMap
}
