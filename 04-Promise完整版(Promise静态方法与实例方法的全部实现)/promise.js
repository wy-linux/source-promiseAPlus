const PENDING = 'PENDING'
const SUCCESS = 'FULFILLED'
const FAIL = 'REJECTED'
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(
          new TypeError('TypeError: Chaining cycle detected for promise #<Promise>')
        )
    }
    let called
    if((x !== null && typeof x === 'object') || typeof x === 'function') {
        try {
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, 
                    y => {
                        if(called) return
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                        // resolve(y)
                    }, 
                    r => {
                        if(called) return
                        called = true
                        reject(r)
                    }
                )
            } else {
                resolve(x)
            }
        } catch (err) {
            if(called) return
            called = true
            reject(err)
        }
    } else {
        resolve(x)
    }
}
class Promise {
    static resolve(value) {
        if(value instanceof Promise) {
            return value
        } else {
            return new Promise((resolve, reject) => {
                resolve(value)
            })
        }
    }
    static reject(reason) {
        if(reason instanceof Promise) {
            return reason
        } else {
            return new Promise((resolve, reject) => {
                reject(reason)
            })
        }
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises.length; i++) {
                promises[i].then(resolve, reject)
            }
        })
    }
    static all(promises) {
        let arr = []
        let j = 0
        function processData(index, data, resolve) {
            arr[index] = data
            j++
            if(i === promises.length) {
                resolve(arr)
            }
        }
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(data => {
                    processData(i, data, resolve)
                }, reject)
            }
        })
    }
    static allSettled(promises) {
        let arr = []
        let j = 0
        function processData(status, index, data, resolve) {
            j++
            arr[index] = {status, data}
            if(j === promises.length) {
                resolve(arr)
            }
        }
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises; i++) {
                promises[i].then((value) => {
                    processData('fulfilled', i, value, resolve)
                }, err => {
                    processData('rejected', i, err, resolve)
    
                })
            }
        })
    }
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        const resolve = (value) => {
            if(this.status == PENDING) {
                this.status = SUCCESS
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if(this.status == PENDING) {
                this.status = FAIL
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch(err) {
            reject(err)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled =  typeof onFulfilled === 'function' ? onFulfilled : (val) => val
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => {throw err}
        let promise2 =  new Promise((resovle, reject) => {
            if(this.status === SUCCESS) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resovle, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            } else if(this.status === FAIL) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resovle, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            } else if(this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resovle, reject)
                        } catch (err) {
                            reject(err)
                        }
                    })                    
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resovle, reject)
                        } catch (err) {
                            reject(err)
                        }
                    })                    
                })
            }
        })
        return promise2
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    finally(callback) {
        return this.then(value => {
            return Promise.resolve(callback()).then(() => value)
        },err=> {
            return Promise.resolve(callback()).then(() => {
                throw err
            })
        })
    }
}

// 希望测试一下这个库是否符合我们的promise A+规范
// promises-aplus-tests
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
  
module.exports = Promise