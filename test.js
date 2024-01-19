// const promiseOne = new Promise(function (resolve, reject) {
//     //do an async task

//     setTimeout(function () {
//         console.log("async task is complete.");
//         //resolve()
//     }, 1000)
// })

// promiseOne.then(function () {
//     console.log("promise Consumed");
// })


// new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log("promise complete");
//         resolve();

//     }, 2000);
// }).then(() => {
//     console.log("Promise Resolved");
// })

// const promiseThree = new Promise((res, rej) => {
//     setTimeout(() => {
//         console.log("In the promise");
//         const error = true
//         if (error) {
//             rej("it got rejected")
//         } else {
//             res({ username: "anukul", email: "anukul@example.com" })
//         }
//     }, 2000);
// });

// promiseThree
//     .then((response) => {
//         console.log(response.username);
//         return response.email
//     })
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((err) => {
//         console.log("got an error", err);
//     })
//     .finally(() => {
//         console.log("resolve or rejected");
//     })


let num = 1

console.log(num);
num.power = 3

console.log(num.power);
console.log(num);
