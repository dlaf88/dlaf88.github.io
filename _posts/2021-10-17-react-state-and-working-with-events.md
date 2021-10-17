---
title: React State and Working with Events
layout: blog_post
categories:
topic: react
tags: react
---

Events and React

# React State and Working with Events

Some html elements have native DOM elements (e.g. HTMLElement has `click`). For these default events there are react events: `onClick`.
``jsx

<button onClick={ clickHandler}>

``

Components are functions and something has to call these functions. Recall the Components return JSX code.

### Who calls these Component functions?

React calls any component functions which returns JSX. React calls the component functions down through any tree hierarchy. For example, if a component function is embedded within a another component function then react calls both of these component functions.

> React executes the Component functions only once.

### How can the DOM be updated when an event occurs?

React needs to be told when a change ,such as an event trigger, leads to a new render of the DOM.

`js import React, {useState} from 'react' `
useState is a react hook which by definition could only be called inside a react component function. useState creates a variable and gives access to the variable.

`js const [title, setTitle] = useState(props.title) `

useState always returns a variable and function; this function can be used to change the state of the variable. When this function is executed `js React` will render the component which contains this function again. If you have data which might change, and the change must be reflected on the DOM then you need to change the state.

### State is local to each instance of the Component.

Recall that you can create different instances of Components within the DOM. When you call a component function React creates an instance of the component function. If the instances of the component contain state, then React manages the state of each instance.

### React state lifecycle.

When you first call the useState within an instance of a component, React creates a variable of the initial state and provides a function to change this variable. One way to think about this would be to imagine that React creates a database that tracks the type of component, the instance id of the component, the valuable of the variable, and the function which changes the related variable.

| componentType    | componentInstanceID | variableName | functionName | variableValue  |
| ---------------- | ------------------- | ------------ | ------------ | -------------- |
| ExpenseComponent | 123                 | title        | setTitle     | myInitialTitle |

`js setTitle() ` Whenever the function is triggered through an event listener, than React renders the instance of the Component with the state of the `VariableName`.

### Gathering User Input

Forms are used to gather user input. `js const NewExpense = () = > ... `. You could add listeners to the html elements of the form ; for example `onClick` for the html element input.`html <input onChange={someFunction} >`. Recall that when an event listener is executed, the browser provides an event object as a parameter to the event listener function.

`js const myLister = (event)=>{ } `
The event parameter contains information about the event execution including the event.target.value which is the value contained within the target html element at the time of the execution.

`js const myLister = (event)=>{ setTitle(event.target.value)} `
This stores the valued of the state.
| componentType | componentInstanceID | variableName | functionName | variableValue |
| ---------------- | ------------------- | ------------ | ------------ | -------------- |
| ExpenseComponent | 123 | title | setTitle | event.target.value |

#### different pieces of State

You can use `useState` multiple times within a component function.

> Tip: If you find yourself useState multiple times, it might be better to restructure the code so that you can use state only once.
> The solution could be that change in state is managed by one `object`.

#### Updating State That Depends on The Previous State

Whenever you update state which depends on other state then you must pass a function to the useState function.

`js setUserInput ( (prevState) => { return {...prevState, enteredTitle: event.target.value}}); `

### Handling Form Submission

There form element has a native submit event.
`html <form onSubmit={submitHandler} > `

#### Two-Way Binding

You can bind the value property inside an target html element.

### Child-to-Parent Component Communication

You pass functions from Parents to Children. Props can only be passed from Parents to Children.

### Lifting State Up or Sibling to Sibling Communication

Siblings can't directly communicate with each other; so changes in information must pass through the parent who is sitting at the top of the tree.
