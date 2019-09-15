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
When you call rspec in the command line rspec (the program) loads the spec directory which loads all the files in that directory. Rspec then loads into memory example groups which are the suite of tests that are called after ```Rspec.describe```.

Here rspec, internally, creates an object called ExampleGroup: 

{% highlight ruby %}
Rspec.describe Project do
...
end
{% endhighlight %}

Here Rspec executes the code inside the do block. As it executes the code it gathers tests which are called after the `it` block. 
{% highlight ruby %}
Rspec.describe Project do
 it 'does something' do
 
 end
end
{% endhighlight %}

 Before running the tests Rspec randomizes the order of the ExampleGroups so that no example group depends on the other.
  <img class="img-responsive" src="https://github.com/dlaf88/dlaf88.github.io/blob/master/img/2019_07_26_17_49_42.png">

### Matchers
The basic syntax of Rspec is ```expect(test_value).to(matcher)```
