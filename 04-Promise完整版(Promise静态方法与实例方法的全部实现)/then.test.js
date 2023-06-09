const Promise = require('./promise')

const p = new Promise((resolve, reject) => {
  resolve('ok')
})
// p.then(val => {
//   console.log(val);
// }, err => {
//   console.log(err);
// })
const p2 = p.then(res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('1000')
          }, 1000)
        })
        // 'wang-yu'
      )
    }, 1000)
  })
})

p2.then(
  data => {
    console.log('data', data)
  },
  err => {
    console.log('err', err)
  }
)
