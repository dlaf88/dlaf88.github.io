---
title: How Pdf JS uses the Struct Tree JS file.
layout: blog_post
categories:
topic: pdf
tags: typescript
---

This is the way that the file `pdf.js` uses the struct_tree.js file.

# How PDF Js Uses The Struct Tree JS file.

### Initial Invocation

At some point pdf.js creates an instance of `js StructTreePage ` which has the following constructor:

```javascript
class StructTreePage {;
	constructor(structTreeRoot, pageDict) {
	this.root = structTreeRoot;
	this.rootDict = structTreeRoot ? structTreeRoot.dict : null;
	this.pageDict = pageDict;
	this.nodes = [];
}

```

Notice that `StructTreePage` requires StructTreeRoot, pageDict, and rootDict. The `this.nodes` is an array of StructElementNode objects. These objects contain children which in turn could contain 

<div class="mermaid">
flowchart TD  
A[StructTreeRoot] --> B[StructParent];  
B --> C[Number Tree]
C --> D[StructElement]

</div>
> Div's are StructElements

### StructElement Hierarchy

<div class="mermaid">
flowchart TD  
A[Div - StructElementNode] --> B[StructElement];  
B --> C[Content];
B --> D[Annotation];

</div>
