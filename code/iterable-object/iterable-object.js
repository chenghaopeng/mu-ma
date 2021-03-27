// 迭代器 Iterator 返回一个函数 next ，每次调用 next 返回 { value, done } 表示当前值与是否完成迭代
// 可迭代 Iterable 即对象具有迭代器属性 [Symbol.iterator]
// 要让对象可迭代，只需要在对象原型上挂上 [Symbol.iterator] 属性
// 这里分别用了传统方法和生成器方法
// 数组的解构运算符、展开运算符就是运用了迭代器

const obj = {
  'a': 1,
  'b': 2,
  [Symbol('c')]: 3
}

const doit = () => {
  for (const [k, v] of obj) {
    console.log([k, v])
  }
}

Object.prototype[Symbol.iterator] = function () {
  console.log('传统方法')
  const keys = Object.keys(this).filter(key => this.hasOwnProperty(key))
  let i = 0
  return {
    next: () => {
      const done = i === keys.length
      const value = done ? undefined : [keys[i], this[keys[i]]]
      i++
      return { value, done }
    }
  }
}

doit()

Object.prototype[Symbol.iterator] = function* () {
  console.log('生成函数')
  for (const key in this) {
    if (this.hasOwnProperty(key)) {
      yield [key, this[key]]
    }
  }
}

doit()

/*
传统方法
[ 'a', 1 ]
[ 'b', 2 ]
生成函数
[ 'a', 1 ]
[ 'b', 2 ]
*/
