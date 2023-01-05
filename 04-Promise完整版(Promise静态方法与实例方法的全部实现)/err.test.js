const Promise = require('./promise')
const p = new Promise((resolve, reject) => {
  // resolve('name-wy')
  console.log(3);
  setTimeout(() => {
    reject('age-23')
    console.log(5);
  });
})
p.then(() => {
    // console.log(2);
}).catch(() => {
    console.log(6);
})
setTimeout(() => {
    console.log(1);
});
console.log(4);
// 3 4 5      ----> 6 ? 1 ?