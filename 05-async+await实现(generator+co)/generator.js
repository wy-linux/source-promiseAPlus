function * read() {
    let a = yield 10
    console.log(a);
    let b = yield 20
    console.log(b);
}
const it = read()
console.log(it.next());
console.log(it.next('第一次执行'));
console.log(it.next('第二次执行'));
