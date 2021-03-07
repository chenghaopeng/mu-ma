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
    const { resolve, reject } = callbacks
    if (this.state === MyPromise.FULFILLED && resolve) {
      resolve(this.value)
    } else if (this.state === MyPromise.REJECTED && reject) {
      reject(this.reason)
    }
  }
  _then () {
    this.callbacks.forEach(callbacks => this._handle(callbacks))
  }
  then (resolve, reject) {
    const callbacks = { resolve, reject }
    this.callbacks.push(callbacks)
    if (this.state !== MyPromise.PENDING) {
      this._handle(callbacks)
    }
  }
  catch (reject) {
    this.callbacks.push({ resolve: null, reject })
  }
  finally (finish) {
    this.then(() => finish(), () => finish())
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('1234')
  }, 1000)
})
p.then(value => {
  console.log('then', value)
})
p.catch(value => {
  console.log('catch', value)
})
p.finally(() => {
  console.log('finish')
})
