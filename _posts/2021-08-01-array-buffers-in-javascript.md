---
title: Array Buffers in Javascript
layout: blog_post
categories:
topic: javascript
tags: javascript
---

### Javascript and Binary Data


I'm currently working on a project which includes the manipulation of binary data. For this reason, I find myself having to review how
binary data works in JS. In Javascript, the basic binary object is ArrayBuffer – a reference to a fixed-length contiguous memory area.

The ArrayBuffer can't be manipulated through the reference but rather through a view object. Say that I want to write into memory the string
'hello world' but that I want to write it in binary form within an allotted area of memory. This is `hello world` in binary:  
```BASH
01101000 01100101 01101100 01101100 01101111 00100000 01110111 01101111 01110010 01101100 01100100

```
Notice that in ASCII `hello world` is composed of 11 bytes. The objective becomes writing this binary into memory by using JS. In Javascript we first have to reference an area of the memory. Let's call this area of memory a buffer.

```Javascript

let buffer = new ArrayBuffer(11); 
```
 `buffer` is a reference to an area of memory composed of: 
```BASH
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000

```
The `new ArrayBuffer(11)` invocation created an area of memory which is in "blank" state so all 11 bytes are composed of 0's. 

### How can we change this so that it looks like the ASCII representation of `hello world`?  

In order to manipulate the binary buffer we have to use a view object ("view"). In JS
there are many classes of binary view objects: Uint8Array, DataView, Blob, File, etc. The view object does not store any state in memory itself but
rather allows the manipulation of the state memory created by a `buffer`. The views `Uint8Arrray Uint16Array Uint32Array and Float64Array` differ in how each of these classes assigns values to the alloted memory. For example:
`Uint8Array` allows ascess to the bits by indexing them as such:
```BASH
(00000000) index 0 (0000000) index 1 ... (0000000) index 10 #this is the 11th byte

```
So to access and manipulate the 11th byte I can do the following:

```Javascript

let buffer = new ArrayBuffer(11); 
let view = new Uint8Array(buffer)
view[10] = 255
```
The new byte state will be:

```BASH
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 11111111

```
The `Uint16Array` will organize the bits into sets of 16 bits (2 bytes) each. If we try to use`Uint16Array` there are some bits which are left behind. 
```BASH
0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 (0000000)<= left behind

```
For this reason its not possible to use `Uint16Array` or `Uint32Array` with a buffer size of 11 bytes. 
```Javascript
RangeError: byte length of Uint32Array should be a multiple of 4
    at new Uint32Array (<anonymous>)

```
But had I initialized 12 bytes then the `Uint16Array` view would have organized the bits as such: 
```BASH
#from
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
#to
0000000000000000 [index 0] 0000000000000000 0000000000000000 0000000000000000 0000000000000000 0000000000000000 [index 5]
```



Getting back to our original example:  
We have to change our byte state from this:

```BASH
00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000

```
To this:
```BASH
01101000 01100101 01101100 01101100 01101111 00100000 01110111 01101111 01110010 01101100 01100100

```  
Let's start with the first byte by consulting an ASCII table: the letter `h` is represented by the decimal 104. Through consultation of the ASCII table and assignment of the `view` object, I have generated the following code:

```Javascript

let buffer = new ArrayBuffer(11);

let view = new Uint8Array(buffer)
view[0] = 104
view[1] = 101
view[2] = 108
view[3] = 108
view[4] = 111
view[5] = 32
view[6] = 119
view[7] = 111
view[8] = 114
view[9] = 108
view[10] = 100


view.forEach((e)=>{
	console.log(String.fromCharCode(e))
})

--- output
h
e
l
l
o
 
w
o
r
l
d
```
The key take aways from this note is that in javascript one type of object allocates memory  and does not allow direct change to the memory state while  another type of object
allows the manipulation of the state. This only the tip of the iceberg and much more information could be found in this good blogpost on [Javascript.Info](https://javascript.info/arraybuffer-binary-arrays)








