let fs = require('fs').promises
function * read() {
    let content = yield fs.readFile('./name.txt', 'utf8')
    let r = yield fs.readFile(content, 'utf8')
    return r 
}
function co(iterator) {
    return new Promise((resolve, reject) => {
        function next(data) {
            let {value, done} = iterator.next(data)
            if(!done) {
                Promise.resolve(value).then((data) => {
                    next(data)
                }, err => {
                    // it.throw(err)//抛出generator中的错误 可以使用try catch 捕获该错误
                    reject(err)
                })
            } else {
                resolve(data)
            }
        }

        next()
    })
}
co(read()).then(data => {
    console.log(data);
}, err => {
    console.log(err);
})