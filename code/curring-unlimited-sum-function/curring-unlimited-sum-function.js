const sum = (...args) => {
  /* 存放所有调用函数的参数 */
  const nums = [...args]
  /* 待会要返回的函数，这个函数的作用是将加数收集 */
  const _sum = function (..._args) {
    nums.push(..._args)
    return _sum
  }
  /* 控制台输出会*可能*会调用，此时进行求和 */
  _sum.toString = function () {
    return nums.reduce((total, value) => total += value, 0)
  }
  return _sum
}

/* 不加 toString() ，Safari 输出 23 ，Chrome 输出 f 23 */
console.log(sum(1, 1, 1, 1)(1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1))
/* 加 toString() ，都输出 23 */
console.log(sum(1, 1, 1, 1)(1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1)(1, 1, 1)(1).toString())
