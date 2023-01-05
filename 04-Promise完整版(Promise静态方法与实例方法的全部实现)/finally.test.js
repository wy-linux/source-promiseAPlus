const Promise = require('./promise')
const p = new Promise((resolve, reject) => {
    resolve('name-wy')
    //   reject('age-23')
})
//传入finally的回调函数,其中的data并不会被给与任何值(resolve,reject抛出的值都不会给与)
p.finally((data) => {
  console.log(data);
}).then((value) => {
    console.log(value);
}).catch((err) => {
    console.log(err);
})