---
title: TDD Continued
layout: blog_post
categories:
topic: Tech
tags: Rails Testing
---
The following details the steps and reasoning I took in following chapter 2 of the book [Rails 5 Test Prescriptions](https://pragprog.com/book/nrtest3/rails-5-test-prescriptions) by Noel Rappin.

## TDD chapter two of Rails 5 Test Prescription
### The Objective of the App
The user creates a project and within this project can makes tasks. The app informs the user of a projected date and rate of completion. The app makes the projected date and rate of completion determinations based on how and when other tasks were completed. The pedantic objective of this exercise is to demonstrate how the TDD guides design choices.

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
The author says that there are two choices of where to start: init state of the primary object or the Happy Path "HP". In this case the primary object is the class ```Project```. The HP is a single representative example of the error-free version of the algorithm. The author chooses to start at the `init` state.

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

running ```bundle exec rspec``` in the command line leads to an error on `uninitialized constant Project`.

### The Next Question
What should a programmer do after the first fail in order to pass the test? The author gives three choices or "ways": 1) purist way 2)practical way 3) the teaching way.

The purist way is writing the min code to get the test passing. The practical way is writing code that the programmer knows will pass plus any additional code that the programmer knows will cause other failures.

In this case, to pass the test create a `Project` model.

{% highlight ruby %}

#inside ./app/models/project.rb
class Project

end
{% endhighlight %}

run ```bundle exec rspec``` and this gets the test passing but now the test fails because there is no ```done?``` method.

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  def done?

  end
end
{% endhighlight %}

running ```bundle exec rspec``` again shows that the test fails but this time because the ```done?``` method is equal to true. The expectation is that is matches be_truthy.

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

At this point the programmer asks in what other ways is the user going to interact with the `Project` model. Remember that the init state regards projects with no tasks, the next spec should be about projects with tasks.

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

So after adding the spec about a project with tasks it becomes clear that the `Task` object is introduced. Additionally the `Project` object now has a ```tasks``` method.

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
    tasks.empty?
  end
end
{% endhighlight %}


### Refactoring Stage

The author introduces the ```let``` method and the Rspec's dynamic matchers. The let method is lazy meaning that it only gets invoked if its called. There is also a let! method which always get called.

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

Notice that in the last test a task was added to the ```project.tasks``` array, but the spec is in regard to the whether an incomplete task was added. The done? method should return true only when all of the tasks found in the tasks array have been completed. In this regard, the next question is about how to test the state of the Task object.

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
    tasks.all(&:complete?)
  end
end
{% endhighlight %}

`what would happen if I run rspec here?`

## Adding the Calculation Features

Remember that the purpose of the app is to forecast the end date for the project. The project uses the data of when the tasks were completed in order to determine a forecast of when the Project will end. This means that the project app must be able to give estimates about the completion date.

{% highlight ruby %}

#inside ./app/models/project.rb
...
#notice that a new describe function is being called
describe "estimates" do
  let(:project){Project.new}
  let(:done){Task.new(size: 2, completed: true)
  let(:small_not_done){Task.new(size: 1)}
  let(:large_not_done){Task.new(size: 4)}


  before(:example) do
    project.tasks = [done, small_not_done, large_not_done]
  end

  #recall that each 'it' block produces an example group
  it 'can calculate total size' do
    expect(project.total_size).to eq(7)
  end


  it 'can calculate remaining size' do
    expect(project.remaining_size).to eq(5)
  end
end
{% endhighlight %}

Notice that the Task object now has size and completed args. That means that the Task object must be changed in the following manner.

{% highlight ruby %}

#inside ./app/models/task.rb
class Task
  attr_accessor :size, :completed
 def initialize(options={})
  @completed = options[:completed]
  @size = options[:size]
 end

 def mark_completed
  @completed = true
 end

 def complete?
  @completed
 end
end
{% endhighlight %}

Similarly the `Project` class has new methods which must be accounted for.

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

  def total_size
    tasks.sum(:&size)
  end

  def remaining_size
    tasks.reject(&:complete?).sum(&:size)
    #reject is called on the tasks array and it returns a new array where each of the elements of the first array are called upon.
  end
end
{% endhighlight %}


### velocity
Velocity is term describing a rate in this case, the rate at which the tasks have been completed. The author stated that only those tasks completed with the last three weeks will count as being completed.



{% highlight ruby %}

#inside ./spec/model/task_spec.rb
require "rails_helper"

...

describe "velocity" do
 let(:task){ Task.new(size: 3)}

 it 'does not count an incomplete task toward velocity'
   expect(task).not_to be_part_of_velocity
   expect(task.points_toward_velocity).to eq(0)  
 end

 it 'counts a recently completed task toward velocity'
   task.mark_completed(1.day.ago)
   expect(task).to be_part_of_velocity
   expect(task.points_toward_velocity).to eq(3)  
 end  

 it 'does not count a long ago task as completed'
   task.mark_completed(1.month.ago)
   expect(task).not_to be_part_of_velocity
   expect(task.points_toward_velocity).to eq(0)  
 end  



end

{% endhighlight %}

Notice here that the Task class gained `mark_completed` and `be_part_of_velocity` and `points_toward_velocity`.


{% highlight ruby %}

#inside ./app/models/task.rb
class Task
 attr_accessor :size, :completed_at

 def initialize(options = {})
  mark_completed(options[:marked_completed]) if options[:marked_completed]
 end

 def mark_completed(date = Time.current)
  @completed_at = date
 end

 def complete?
  completed_at.present?
 end

 def part_of_velocity?
  return false unless complete?
  completed_at > 21.days.ago
 end


 def points_toward_velocity
     part_of_velocity? ? size : 0
 end

end
{% endhighlight %}


Next up is setting specs for the `Project` class

{% highlight ruby %}

#inside ./spec/model/project_spec.rb
require rails_helper

let(:project){ Project.new }
let(:newly_done){ Task.new(size: 3, completed_at: 1.day.ago)}
let(:old_done){ Task.new(size: 2, completed_at: 6.months.ago)}
let(:small_not_done){ Task.new(size: 1)}
let(:large_not_done){ Task.new(size: 4)}

before(:example) do
  project.tasks = [newly_done, old_done, small_not_done, large_not_done]
end

it "knows its velocity" do
  expect(project.completed_velocity).to eq(3)
end

it "knows its rate" do
  expect(project.current_rate).to eq(1.0/7)
end


it "knows if it is not on schedule" do
  expect(project.projected_days_remaining).to eq(35)
end

it "knows if it is on schedule" do
  project.due_date = 6.months.from_now
  expect(project).to be_on_schedule
end

end
{% endhighlight %}


Revising the `Project` class leads to the following result:

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  attr_accessor :tasks,:due_date

  def initialize
    @tasks = []
  end
  def done?
    task.all(&:complete?)
  end

  def total_size
    tasks.sum(:&size)
  end

  def remaining_size
    tasks.reject(&complete?).sum(&:size)
    #reject is called on the tasks array and it returns a new array where each of the elements of the first array are called upon.
  end

  def completed_velocity
    tasks.sum(&:points_toward_velocity)
  end

  def current_rate
    return completed_velocity* 1.0 /21.0
  end

  def projected_days_remaining
    remaining_size/current_rate
  end

  def on_schedule?
    Time.zone.today + project_days_remaining <= due_date
  end
end
{% endhighlight %}

### Special cases
It is time to think about the edge cases. What happens when a project is blank meaning there are no task

{% highlight ruby %}
  ...
  #inside /spec/models/project_spec.rb

  it "handles a blank project" do
    expect(project.completed_velocity).to eq(0)
    expect(project.current_rate).to eq(0)
    expect(project.projected_days_remaining).to be_nan
    expect(project).not_to be_on_schedule

  end

{% endhighlight %}

{% highlight ruby %}

#inside ./app/models/project.rb
class Project
  attr_accessor :tasks,:due_date

  def initialize
    @tasks = []
  end

  def self.velocity_in_days
    21
  end
  def done?
    task.all(&:complete?)
  end

  def total_size
    tasks.sum(:&size)
  end

  def remaining_size
    tasks.reject(&complete?).sum(&:size)
    #reject is called on the tasks array and it returns a new array where each of the elements of the first array are called upon.
  end

  def completed_velocity
    tasks.sum(&:points_toward_velocity)
  end

  def current_rate
    return completed_velocity* 1.0 /Project.velocity_in_days
  end

  def projected_days_remaining
    remaining_size/current_rate
  end

  def on_schedule?
    return false if project_days_remaining.nan?
    (Time.zone.today + project_days_remaining) <= due_date
  end
end
{% endhighlight %}
