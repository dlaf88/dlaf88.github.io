---
title: First notes on TDD.
layout: blog_post
categories: 
topic: Tech
tags: Rails Testing 
---


## Classic Test-Driven Development Process

1. Create the Test. The test should be for one 'thing' in the code.
2. Make sure the Test Fails.
3. Write the Simplest Code that could possibly make the test pass.
4. Refactor to Improve the code.


### Why does TDD make a difference?
TDD helps with software design, which is anything in the code that goes beyond the logical correctness of the code. For example, the speed of the code, clarity of naming, robustness against errors, resistance to change, and ease of maintenance.

### How does TDD help with software design?
By following the 4 steps the code will tend to result in code that is made up of small methods, each of which does one 'thing.' This will result in code that is less decoupled. Tests also monitor the quality of the code base. If it becomes difficult to write tests, that often means your codebase is too interdependent.

### Why use TDD instead of some other processes?
There are other types of testing.Testing your application assumes that you know the right answer to specify. Sometimes you don't know exactly what the programs needs to do. In acceptance testing you test that the code does what the user expects the code to do.

### Does TDD make you a better developer?
In certain areas but becoming a better developer requires the improvement of many different skills.

### Does TDD make you a faster or more efficient developer?
Yes, but the most noticeable savings occur in the long run.


### Some Mechanics of TDD
When you call rspec in the command line rspec (the program) loads the spec directory which loads all the files in the directory. Rspec then loads into memory example groups which are the suite of tests that are called after ```RSPEC.describe```.

Here rspec creates an object called ExampleGroup.
{% highlight ruby %}
Rspec.describe do Project
...
end
{% endhighlight %}

Rspec continues to execute the code in the block. After `it` rspec stores the tests and the arguments as what are called examples. 
{% highlight ruby %}
Rspec.describe do Project
 it 'does something' do
 
 end
end
{% endhighlight %}

 

### Matchers
The basic syntax of Rspec is ```expect(test_value).to(matcher)```
