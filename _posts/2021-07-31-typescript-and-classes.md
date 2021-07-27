---
title: Typescript and Classes
layout: blog_post
categories:
topic: Tech
tags: typescript javascript
---

## Typescript and Classes

What are classes in javascript generally?

The class syntax allows for programming blueprints, so that we can use such blueprints as objects within javascript.

How is the class syntax used?

The blueprint is programmed by using the class syntax along with a constructor function. Each derivative object created from the class can have properties and methods (i.e functions).

```typescript

class Department {

constructor(){

}

}

```

How are the objects instantiated? 

The objects are instantiated by using the `new` syntax which is part of the ES6 javascript core.

```typescript

let accounting = new Department()

```
Suppose that I wanted to add a name to the Department:

```typescript

class Department {
name:string;
constructor(name:string){
this.name = name
}

}

```
Notice that the first invocation of `name:string;` is a typescript only invocation because such syntax will not be "understood" by javascript. Writing `name:string` means that we are declaring the name variable as a string.
The next invocation of the `name:string` as a parameter within the constructor function relates to the parameter which will be passed down as a property to the objects instantiated through the class.
`this.name` assigns the `name` parameter to the property name.


### On `this`

The `this` syntax as used above relates to the instantiated object. The constructor function is called when the object is created. In typescript we can write:

```typescript

class Department {
name:string;
constructor(name:string){
this.name = name
}

}

```

