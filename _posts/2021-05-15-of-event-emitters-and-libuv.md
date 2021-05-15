---
title: On Event Emitters and Libuv
layout: blog_post
categories: 
topic: Node
tags: Node
---

### Socratic Method
I'm going to try the Socratic Method (ie ask myself a series of questions) to think more critically about a specific topic. Thus, the following is a series of questions related event emitters found in the node js library. My objective is to learn in a more interactive manner by asking myself more questions and that the answers provided to my questions serve me in the future as reference.


## Event Emmitters
### 1. What are Event Emitters in node JS?

Event Emitters are objects which are part of the core node JS library. For example to invoke an event emitter in code write the following:

```javascript
let EventEmitter = require('events');
```
The class EventEmitter allows objects which inherit from it to inherit the functions `on` and `emit`. Instead of writing code which specifies conditions such `if(something happens){ do this }` an object which inherits from the EventEmitter object can invoke a piece of code with similar functionality to `if(something happens){ do this }`, by running code such as `emitter.on('data',()=>{run this function})`. 

### 2. How do Event Emitters work in node JS?

The idea is that the event emitter instance has a local object which has different events stored under different keys. For example an instance could have the following object as a local property:
```javascript
{'data': [function1(){},function2(){},function3(){}],
'onClick': [renderStyling(){}]
}
````
If you run `eventinstance.on('data',function4(){})` you have just added another function to the event called `data`. The new function as well as the preceding functions would get called when somewhere inside you call `eventinstance.emit('data')`.

### 3. How do system events work in node JS?

There is a different between JS events which use the EventEmitter object and OS events which are managed by a C++ library called libuv. Libuv sends a request to the OS and when that piece of code finishes its execution libuv creates a queue. Libuv runs an event loop whereby it checks the queue and runs callback functions through the V8 Javascript engine. For example imagine that the OS event on `fs.readFile()` is called. This function is a call on the OS since the OS must ultimately read the file from memory. Once the file reading is finished, libuov places on the queue the event that file reading has finished. Libuv then utlimately runs some abritrary callback function.

