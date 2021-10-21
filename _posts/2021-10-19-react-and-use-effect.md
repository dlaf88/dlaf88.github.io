---
title: UseEffect, UseMemo, and UseRef
layout: blog_post
categories:
topic: Tech
tags: Javascript react
---
How the function useEffect works in React.
### React changes the DOM when the state of a component changes.
After the state of a component changes, react then rerenders the component. Any function which is not involved in changing the state of the JSX code is 
an effect of the component (eg a fetch of an api). The UseEffect hook is used to call functions after the render of a component. The `UseEffect()`function takes two parameters
a function and an array. The array should include the dependencies of the function which the hook calls. 

### Why is this function needed? 


