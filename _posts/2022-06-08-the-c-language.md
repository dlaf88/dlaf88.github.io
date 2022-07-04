--- 
title: Learning the C Language
layout: blog_post
categories:
topic: Tech
tags:
--- 
I'm currently learning the C Language in order to improve my programming skills. I'm writing this post in order to remember the Lessons from the book **Effective C**.
## The main players in C.

The first concept in any programming language is that of values and how such values are physically represented in a medium. Computers contain memory cells which physically store states of bits for example `0100`. Such bits are  physically stored inside a memory cell but they do not have significance to humans until we give them some value.

### Bit Patterns
The bit is the smallest unit of information in a computer. Bit patterns (e.g. groups of bits) are represented by humans in different formats (e.g. binary, octal, hexadecimal).

### Values 
Values are mental representations of 'things'. For example, the bit pattern,  `1001` can, in the mind of some humans  mean duck. Collectively we have standardized certain bit patterns to mean specific things such as numbers and characters. Sometimes one pattern e.g. `1001` can have two different values. In order to have some manner of determining specific values, the C language uses types.

### Types
A type is an information unit that provides context to decipher the precise value of a bit pattern. For example `1001` as type `int` means the number 2 but as type `char` can mean the letter 'b'. Types allows humans to reuse the same bit patterns in order to represent a host of different 'things'. The C language has a limited number of types.

#### First Rule of C
In C there are three major types: object types and function types.

### Objects
Objects are >> memory storage which can represent values. 
Objects are bit patterns that together with type represent specific a specific value.

#### Properties of Objects
Objects have a type, a memory address, a lifetime, and a value. 

### Variables
Variables are objects which are referenced through a human readable identifier. As the name suggests, the identifier helps with the identification of objects. Variables must be declared with a type and identifier.
Variables are like a  person's name; a name like 'Bob' may be a reference to a real human being but the sequence of letters 'Bob' are not themselves the real human being. Similarly a variable `int a` references a bit pattern
but `a` is not itself the bit pattern.

```c
int main(void){
  int a = 21;
}
```
Here a human is declaring to the computer that a bit pattern of type of 'int' with the value of 21 should be referenced by the character 'a'. Because 'a' is an object
it has a type, memory address, a lifetime, and a value.

### Functions
Functions are also stored in memory but are representations another kind of 'thing'. Functions are procedures which define how bit patterns change.
A function is imperative knowledge which represents 'how' something should be done. In C functions have types which are  characterized by the function's return value and the number and types of its parameters. 

### Properties of Functions
Functions are defined with parameters. Parameters declare a type and establish an identifier which.

```c 
 void swap(int a, int b){
  
  }

```
This swap function will return a value of type void and requires two parameters: in this case 2 objects of type of int. 

### Pointers
Pointers are memory addresses. Pointers also have types which are derived from a function or object type called the reference type.

```c
char *src;
```
The identifier src is a pointer which references an object of type character. Pointers are addresses  


### Scope
The concept of scope relates to the relationship between identifier and value. Specifically, the scope delimits when a certain identifier is expected to have a value.

```c
int a = 21;
void caller(int a){
  a = 21;   

}
```









