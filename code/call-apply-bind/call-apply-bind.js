Function.prototype.myCall = function (context, ...args) {
  /* 如果 function 中 this 为 undefined ，则为严格模式，否则为非严格模式 */
  const isStrict = (function () { return this === undefined })()
  if (!isStrict) {
    /* 如果 context 是原始类型，打包为对象 */
    const type = typeof context
    if (type === 'number') {
      context = new Number(context)
    } else if (type === 'string') {
      context = new String(context)
    } else if (type === 'boolean') {
      context = new Boolean(context)
    }
  }
  /* 如果没有指定上下文，则直接执行原函数（严格模式下上下为仍然为 undefined ，非严格模式下会自动获得 window 或 global */
  if (context === null || context === undefined) {
    return this(...args)
  }
  /* 创建新 Symbol 为键，将函数挂载到 context 对象上 */
  const symbol = Symbol(context)
  context[symbol] = this
  /* 在 context 上调用函数 */
  const result = context[symbol](...args)
  /* 回收垃圾 */
  delete context[symbol]
  return result
}

/* 和 call 唯一的区别是参数，call 使用剩余参数，apply 使用数组 */
Function.prototype.myApply = function (context, args) {
  const isStrict = (function () { return this === undefined })()
  if (!isStrict) {
    const type = typeof context
    if (type === 'number') {
      context = new Number(context)
    } else if (type === 'string') {
      context = new String(context)
    } else if (type === 'boolean') {
      context = new Boolean(context)
    }
  }
  args = Array.isArray(args) ? args : []
  if (context === null || context === undefined) {
    return this(...args)
  }
  const symbol = Symbol(context)
  context[symbol] = this
  const result = context[symbol](...args)
  delete context[symbol]
  return result
}

/* 不支持 new 的 bind ，和 call 的区别在于，返回一个新函数，在新函数里调用挂载好的函数 */
Function.prototype.myBind = function (context, ...args) {
  const isStrict = (function () { return this === undefined })()
  if (!isStrict) {
    const type = typeof context
    if (type === 'number') {
      context = new Number(context)
    } else if (type === 'string') {
      context = new String(context)
    } else if (type === 'boolean') {
      context = new Boolean(context)
    }
  }
  if (context === null || context === undefined) {
    const that = this
    return function (..._args) {
      return that(...args, ..._args)
    }
  }
  const symbol = Symbol(context)
  context[symbol] = this
  return function (..._args) {
    return context[symbol](...args, ..._args)
  }
}

/* 支持 new 的 bind */
Function.prototype.myBind2 = function (context, ...args) {
  const that = this
  function Bound (..._args) {
    /* 当 this 是 Bound 的实例时，说明是以 new 的方式作为构造函数调用 */
    return that.call(this instanceof Bound ? this : context, ...args, ..._args)
  }
  /* 继承函数原型 */
  Bound.prototype = Object.create(this.prototype || Function.prototype)
  return Bound
}

const obj = {
  a: 123,
  b: 456
}

function add (...args) {
  return this.a + this.b + args.reduce((t, v) => t += v, 0)
}

console.log(add.myCall(obj, 2, 3))
console.log(add.myApply(obj, [1, 2, 3, 4]))
console.log(add.myBind(obj, 2, 3)())
console.log(add.myBind2(obj, 2, 3)())
console.log([].slice.myCall([1, 2, 3, 4, 5], 2, 4))
console.log([].slice.myApply([1, 2, 3, 4, 5], [2, 4]))
console.log([].slice.myBind([1, 2, 3, 4, 5], 2, 4)())
console.log([].slice.myBind2([1, 2, 3, 4, 5], 2, 4)())
console.log(Math.max.myCall(null, 5, 6, 7, 8, 9))
console.log(Math.max.myApply(null, [5, 6, 7, 8, 9]))
console.log(Math.max.myBind(null, 5, 6, 7, 8, 9)())
console.log(Math.max.myBind2(null, 5, 6, 7, 8, 9)())

function Person (name, age) {
  this.name = name
  this.age = age
}

const Pengpeng = Person.myBind2(null, '鹏鹏')
const pengpeng = new Pengpeng(21)
console.log(pengpeng)
console.log(pengpeng instanceof Pengpeng)
console.log(pengpeng instanceof Person)
