---
title: TDD Continued
layout: blog_post
categories: 
topic: Tech
tags: Rails Testing 
---


## TDD chapter two of Rails 5 Test Prescription

The following is the sequence of events a programemr is to take when making an app about Projects and Tasks while learning about TDD. The objective of the app is to have the a project with a set of tasks and a user would be able to determine the project's end date and rate of completion based on how and when other tasks were completed. The pedantic objective of this exercise is to demonstrate how the TDD guides design choices.

### Logistics

{% highlight ruby %}
#in the Gemfile

group :development, :test do
  gem "rspec-rails", "~> 3.7.0"
end
{% endhighlight %}


{% highlight ruby %}
bundle install
rails generate rspec:install
{% endhighlight %}

### Where to Start
The book states that there are two choices: init state of the a primary object in this class ```Project``` or what it calls the happy path. The HP is a single representative example of the error-free version of the algorithm. The init state of the project is where the author starts.

{% highlight ruby %}

#inside ./spec/model/project_spec.rb
require rails_helper

Rspec.describe Project do
  it "considers a project with no tasks to be done" do
    project = Project.new
    expect(project.done?).to be_truthy
  
  end

end
{% endhighlight %}

running ```rspec``` in the command line leads to an error on uninitialized constant Project. The author then questions what path should a programmer take in passing the test. The author gives three choices 1) purist 2)practical way 3) the teaching way.

The purist way is writing the min code to get the test passing. The practical way involves writing the code that you need to eventually write to get the test passing.

To pass the test 

{% highlight ruby %}

#inside ./app/models/project.rb
class Project

end
{% endhighlight %}

run ```rspec``` and this gets the test passing but now the test fails because there is no ```done?``` method.

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  def done?

  end
end
{% endhighlight %}

running ```rspec``` again shows that the test fails because the ```done?``` method is equal to true. The expectation is that is matches be_truthy.

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  def done?
    true
  end
end
{% endhighlight %}

The test finally passes.

### Second Test

Remember that the init state regards projects with no tasks, the next spec should be about projects with tasks. 

{% highlight ruby %}

#inside ./spec/model/project_spec.rb
require rails_helper

Rspec.describe Project do
  it "considers a project with no tasks to be done" do
    project = Project.new
    expect(project.done?).to be_truthy  
  end
  
  it "considers a project with an incomplete task to not be done" do
    project = Project.new
    task = Task.new
    project.tasks << task
    expect(project.done?).to be_falsy
  end

end
{% endhighlight %}

So after adding the spec about a project with tasks it becomes clear that the Task object is introduced. Additionally the Project object now has a ```tasks``` method.

running ```rspec``` leads to a failure about the uninitialized constant Task. To fix this error:


{% highlight ruby %}

#inside ./app/models/task.rb
class Task
 
end
{% endhighlight %}

To fix the failing test regarding the Project.tasks method:

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  attr_accessor :tasks
  
  def initialize
    @tasks = []
  end
  def done?
    true
  end
end
{% endhighlight %}


### Refactoring Stage

The author introduces the ```let``` method and the Rspec's dynamic matchers. The let method is lazy meaning that only gets invoked if its called. There is also a let! method which always get called.

Refactoring the ```project_spec.rb``` leads to:

{% highlight ruby %}

#inside ./spec/model/project_spec.rb
require rails_helper

let(:project){ Project.new }
let(:task){Task.new }

Rspec.describe Project do
  it "considers a project with no tasks to be done" do
    expect(project).to be_done
  end
  
  it "considers a project with an incomplete task to not be done" do
    project.tasks << task
    expect(project).to_not be_done
  end

end
{% endhighlight %}

The ```be_done``` matcher is a dynamic matcher created through Ruby's metaprogramming capabilities. 

Notice that in the last test a task was added to the ```project.tasks``` array, but the spec is in regard to the whether an incomplete task was added. In this regard, the next question arises about how to test the state of the Task object.

{% highlight ruby %}

#inside ./spec/model/task_spec.rb
require "rails_helper"

RSpec.describe Task do
  let(:task) {Task.new}
  
  it "does not have a new task as complete" do
    expect(task).not_to be_complete
  end
  
  it "allows us to complete a task" do
    task.mark_completed
    expect(task).to be_complete  
  end

end

{% endhighlight %}

To make the tests pass the following changes must be done to the Task object.

{% highlight ruby %}

#inside ./app/models/task.rb
class Task
 def initialize
  @complete = false
 end
 
 def mark_completed
  @complete = true
 end
 
 def complete?
  @complete
 end
end
{% endhighlight %}


Make these changes to the Project Spec:

{% highlight ruby %}

...
it 'marks a project done if its tasks are done' do
  project.tasks << task
  task.mark_completed
  expect(project).to be_done
end
{% endhighlight %}

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  attr_accessor :tasks
  
  def initialize
    @tasks = []
  end
  def done?
    task.all(&:complete?)
  end
end
{% endhighlight %}

`what would happen if I run rspec here?`
