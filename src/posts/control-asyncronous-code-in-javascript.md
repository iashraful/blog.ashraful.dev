---
title: Control asynchronous code in JavaScript
date: 2019-03-22T02:39:48.644Z
excerpt: Javascript is asyncronous. Sometime async sucks. Here we'll talk about how to control them.
type: post
blog: true
tags:
  - javascript
  - es6
  - asyncronous
  - webdev

---

### Synchronous vs Asynchronous?
* **Synchronous** is a term for executing program sequentially. In short, we will call it **sync**
* **Asynchronous** is a term for executing program sequentially but when it has a blocking call, it doesn't wait rather than execute next line. In short, we will call it **async**

### Is Asynchronous sucks?
**NO.** It's good for some reason. For example, you have millions of network activity like you have a large number of users. In that case, it's really suitable to use an asynchronous way.

### How write synchronous code is javascript?
We already know javascript follows the asynchronous architecture. Where it follows single-threaded concurrency. Let's not talk so much rather than see an example.

**Look at the following code**
```javascript
function foo() {
    console.log("I am foo function")
    setTimeout(() => {
        console.log("This will delay 3 seconds")
    }, 3000)
    console.log("Function Ended")
}

```

**OUTPUT:**
>I am foo function
>Function Ended
>This will delay 3 seconds

We have clearly seen the behavior of asynchronous programming. Do you have any idea to print the 3rd line before the second? No worry. We will talk about it. There are some ways to achieve this. Let's do it.

##### Example (Promise Implementation)
```javascript
function delayThreeSeconds() {
    // Return new promise
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("This will delay 3 seconds")
            // simple resolve the promise
	    resolve(/* We can pass data here. */)
        }, 3000)
    })
}

// Rewrite the foo funtion and call the delayThreeSeconds function
function foo() {
    console.log("I am foo function")
    // Now program will wait 3 seconds to resolve from delayThreeSeconds funtion
    delayThreeSeconds().then(() => {
        console.log("Function Ended")
    })
}

// Another way to call it
async function foo() {
    console.log("I am foo function")
    // Now program will wait 3 seconds to resolve from delayThreeSeconds funtion
    await delayThreeSeconds()
    console.log("Function Ended")
}
```
**OUTPUT:**
>I am foo function
>This will delay 3 seconds
>Function Ended