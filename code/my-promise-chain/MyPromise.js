class MyPromise {
  static PENDING = Symbol()
  static FULFILLED = Symbol()
  static REJECTED = Symbol()
  constructor (executor) {
    this.state = MyPromise.PENDING
    this.value = undefined
    this.reason = undefined
    this.callbacks = []
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (e) {
      this._reject.bind(this)(e)
    }
  }
  _resolve (value) {
    this.value = value
    this.state = MyPromise.FULFILLED
    this._then()
  }
  _reject (reason) {
    this.reason = reason
    this.state = MyPromise.REJECTED
    this._then()
  }
  _handle (callbacks) {
    const { resolve, reject, nextResolve, nextReject } = callbacks
    if (this.state === MyPromise.FULFILLED) {
      try {
        if (typeof resolve === 'function') {
          const x = resolve(this.value)
          if (typeof x !== 'undefined') {
            nextResolve(x)
          } else {
            nextResolve(this.value)
          }
        } else {
          nextResolve(this.value)
        }
      } catch (e) {
        nextReject(e)
      }
    } else if (this.state === MyPromise.REJECTED) {
      try {
        if (typeof reject === 'function') {
          const x = reject(this.reason)
          if (typeof x !== 'undefined') {
            nextResolve(x)
          } else {
            nextReject(this.reason)
          }
        } else {
          nextReject(this.reason)
        }
      } catch (e) {
        nextReject(e)
      }
    }
  }
  _then () {
    this.callbacks.forEach(callbacks => this._handle(callbacks))
  }
  then (resolve, reject) {
    const that = this
    const nextPromise = new MyPromise((nextResolve, nextReject) => {
      const callback = { resolve, reject, nextResolve, nextReject }
      that.callbacks.push(callback)
      if (that.state !== MyPromise.PENDING) {
        that._handle(callback)
      }
    })
    return nextPromise
  }
  catch (reject) {
    return this.then(undefined, reject)
  }
  finally (finish) {
    return this.then(() => finish(), () => finish())
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(0)
  }, 1000)
})
.then(value => {
  console.log('111')
  console.log('then', value)
  return value + 1
})
.then(value => {
  console.log('222')
  console.log('then', value)
  return value + 1
})
.then(value => {
  console.log('333')
  console.log('then', value)
  throw '234'
})
.then(value => {
  console.log('444')
  console.log('then', value)
  return value + 1
})
.catch(value => {
  console.log('catch', value)
  return 0
})
.finally(() => {
  console.log('finish')
})
.then(value => {
  console.log('999')
  console.log('then', value)
})
