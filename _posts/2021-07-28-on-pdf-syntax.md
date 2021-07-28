---
title: On Pdfs
layout: blog_post
categories:
topic: Tech
tags: pdf 
---

# On PDF syntax

I have been working on a project which involves the manipulation of the pdf file. For this reason, I'm learniing how the pdf operates internally.
These are some reminders on how the pdf syntax works.

## Syntax
The pdf is written in a syntax containing 9 types of elemental objects. The objects are:  
1. Null 
2. Integer
3. Real
4. Boolean
5. Array
6. Dictionary
7. String
8. Name
9. Stream

The `Name` objects are similar to the keys found in JS `{"key": }`. An example of a Name Object is the `/Name` or `/S`.  
The `String` objects can be written in various ways but are either encapsulated with a ( ) or < >. Strings written within < > are to be
written in the base 64 format. The strings written within ( ) could be written in various forms.
```bash
(Testing) % ASCII  
(A\053B) % Same as (A+B)  
(Français) % PDFDocEncoded  
<FFFE0040> % Text with leading BOM  
(D:19990209153925-08'00') % Date  
<1C2D3F> % Arbitrary binary data  
```
The `Array` object is heterogenous object type that can contain any of the other object types. The other object types can be written in any order.  
The `Dictionary` is the most common object type. The dictionary is composed of key-value pairs. The keys must be name object types while the values can be
could be of any object type including other dictionaries. The Dictionary object can be of any size and the keys/value pairs could be unsorted. The `Dictionary` type 
```Bash
% a more human-readable dictionary
<<
/Type /Page
/Author (Leonard Rosenthol)
/Resources << /Font [ /F1 /F2 ] >>
>>
% a dictionary with all white-space stripped out
<</Length 3112/Subtype/XML/Type/Metadata>>
```
A subtype of the dictionary is the `Name Tree`. The tree must contain keys which are of type `string` and are required to be sorted according to the standard
Unicode collation algorithm. The Name tree maps a name of type string to some other object. Suppose that I want to map the states in the United States with
the date that they joined the United States. An example of such mapping would consist of the following example: New Jersey => 12/12/1787. According to the ISO specification,
a Name Tree can contain leaf nodes. So one way to write the mapping is to write:

```Bash
<</Names [(Delaware) (% Date) (Pennsylvania) (%Date) ... (Hawaii) (%Date)]>>
```
However, since the Name Tree can contain leaf nodes, another way to write the whole tree is to write:
```Bash
<</Kids [ 4 0 R 6 0 R] >>
```
Here the name object /Kids references an array of indirect objects which are leaf nodes. By following the tree leafs, eventually a dictionary type with the /Names will be found.
```Bash
<</Names [(Delaware) (% Date) (Pennsylvania) (%Date) ... >>
```

The leaf nodes which do not contain the /Name key must contain a Limits key which serves as index:
```Bash

<</Limits [(Delaware)(Pennsylvania)]
...
>>
```
The ISO specification states the Limits array shall be an array of two strings, that shall specify the lexically least and greatest keys included in the Names array of a leaf node or
in the Names arrays of any leaf nodes that are descendants of an intermediate node.

The Number Tree is conceptually similar to the Name Tree except that instead of `/Names` it must contain a `/Nums` key which points to an array value. The /Nums value array must contain elements whose
keys are established in ascending order. One way to think about this dictionary is the function F(number) => value. One practical example could be to find the associated value of some arbitrary element.

The Stream Object is an arbitrary set of bytes which could represent images, files, or other blobs of data. The stream object must be preceded with a stream dictionary which must contain the key /Length. The blob of data itself must
contain the keywords `stream`  BLOB of data ... `endstream`.

#### On references and declaration

The objects mentioned above could also be referenced using a system akin to the ```javascript var a = object ``` used in javascript. To instead of declaring an object as `var a =` the pdf syntax
uses the keywords `obj` and `endobj` preceding the `obj` keyword a declaration of the numerical object reference must be stated. For example `var obj_3 = object` could be written as
```Bash
3 0 R obj

%some object goes here


endobj
```

Once a declaration has been made the object reference could be used within arrays and dictionaries. Some dictionaries subtypes such as the Name Tree and the Num Tree only accept object references as values.
The numberical value of each object must be unique and when the declaration is made the numerical value must be preceded by `0 R`.





