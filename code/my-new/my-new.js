function myNew (constructor, ...args) {
	/* 以函数原型作为原型创建空对象 */
	const obj = Object.create(constructor.prototype)
	/* 以新对象为上下文执行构造函数 */
	const result = constructor.apply(obj, args)
	/* 如果返回值为 object 则返回该返回值 */
	if (typeof result === 'object') return result
	/* 否则返回新对象 */
	return obj
}

function Person (name, age) {
	this.name = name
	this.age = age
	/* 如果这里返回了 [] 那么构造函数得到的就是 [] */
	// return []
}

const person1 = new Person('1', 1)
const person2 = myNew(Person, '2', 2)
console.log(person1, person2)
console.log(person1 instanceof Person, person2 instanceof Person)
