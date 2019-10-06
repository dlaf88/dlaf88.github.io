---
title: TDD and chapter 3
layout: blog_post
categories:
topic: Tech
tags: Rails Testing
---

## Where we left off

The objective of the last chapter was to test `Project` and `Task` objects which through TDD passed their respective tests. The `Project` objects could calculate the estimated time of completion based on the velocity rate of completed associated tasks. We also had `Task` objects that had functions such as `marked_completed`.


### On to the task at hand

The task at hand now involves thinking about project or system requirements. The author of the book states that a user in the project must be able to do the following:

1. A user can enter a task, associate it with a project, and also see it on a project page.
2. A user can create a project and seed it with tasks using the `task name:size`
3. A user can mark as complete a task.
4. A project can display its progress.


Remember that the author started the TDD process thinking about the main object of the app and what it had to do. The first test involved the `project.done?`. Here we are talking about requirements that a user must do in order mark a project as done. The following tests involve the concept of Outside-in testing. Such tests are considered outside-in because it involves testing a feature from "the outside" and augmenting it with unit tests that drive the inside "inside tests".


### Some housekeeping


{% highlight ruby %}
  #inside the rails_helper file uncomment the following line

  Dir[Rails.root("spec/support/\*\*/\*.rb")].each{ |f| require f}

{% endhighlight %}

This causes rails to autoload all of the files found in the `spec/support/` folder.

Next the following
{% highlight ruby %}
  #/spec/support/system.rb

  config.before(:each,type: :system) do
    driven_by :rack
  end

{% endhighlight %}

This code tells rails how run end-to-end system tests. In this case such tests are driven by rack.


### On to the matter at hand

{% highlight ruby %}
  #inside the /spec/system/add_project_spec.rb file

  RSpec.describe "adding a new project", type: :system do
      it "allows a user to create a project with tasks" do
        visit new_project_path
        fill_in "Name", with: "Project Runway"
        fill_in "Tasks", with: "Choose Fabric:3\nMake it Work:5"
        click_on("Create Project")
        visit projects_path
        expect(page).to have_content("Project Runway")
        expect(page).to have_content(8)
      end

  end
{% endhighlight %}


### The first Test

It is time to run the following rails commands because we now need to test Rails features.

`rails g resource project name:string due_date:date`
`rails g resource task project:references title:string size:integer completed_at:datetime`

`WARNING` Don't allow Rails to override the project model or the project_spec test.

Running `bundle exec rspec` on test produces the result `missing method new_project_path`. That method is a Rails method that is inherited by model objects through the `ApplicationRecord` object.

{% highlight ruby %}
  #inside the /app/models/project.rb
  class Project < ApplicationRecord #now inherits from ApplicationRecord
    has_many :task, dependent: :destroy #association methods

    def self.velocity_length_in_days
      21
    end

    def incomplete_tasks
      tasks.reject(&:complete?)
    end

    def done?
      incomplete_tasks.empty?
    end

    def total_size
      tasks.sum(&:size)
    end

    def remaining_size
      incomplete_tasks.sum(&:size)
    end

    def completed_velocity
      tasks.sum(&:points_toward_velocity)
    end


    def current_rate
      completed_velocity * 1.0/Project.velocity_length_in_days
    end


    def projected_days_remaining
      remaining_size / current_rate
    end


    def on_schedule?
      return false if projected_days_remaining.nan?
      (Time.zone.today + projected_days_remaining) <= due_date
    end



  end
{% endhighlight %}



{% highlight ruby %}
  #inside the /app/models/task.rb
  class Task < ApplicationRecord
    belongs_to :project

    def marked_completed(date = Time.current)
      self.completed_at = date
    end


    def complete?
      completed_at.present?
    end


    def part_of_velocity?
      return false unless complete?
      completed_at > Project.velocity_length_in_days.days.ago
    end


    def points_toward_velocity
      part_of_velocity? ? size : 0
    end

  end
{% endhighlight %}

`rails db:migrate`

Running `rspec` now causes a different error. The error is related to controller because Rails expects a project controller. When a user clicks on a link created by new_project_path, Rails sends the user to the new controller of the `Project` model.


{% highlight ruby %}
  #inside the /app/controllers/projects_controller.rb
  class ProjectsController < ApplicationController
    def new
      @project = Project.new
    end
  end
{% endhighlight %}

`bundle exec rspec` now causes errors related to form view because Rails expects a related view template.



{% highlight ruby %}
  #inside the /app/views/projects/new.html.erb

  <h1> New Project</h1>
  <%= form_for(@project) do |f| %>
    <%= f.label(:name) %>
      <%= f.text_field(:name) %>
    <br />
      <%= f.label(:tasks) %>
      <%= f.text_area_tag("project[tasks]") %>
    <br />
      <%= f.submit %>   
  <% end %>
{% endhighlight %}

Here the form object sends the data to the `ProjectsController` `def new`.

### Setting Up The Workflow

Where should business logic be placed within the code? The three places the author states are 1) the controller 2) the model 3) separate class to encapsulate the logic and the workflow.

The author states that the controller is not a great place to place the business logic because the controller is difficult to test. The author goes with the third option.

{% highlight ruby %}
  #inside spec/workflows/creates_project_spec.rb
  require 'rails_helper'

  RSpec.describe CreatesProject do
    it 'creates a project given a name' do
      creator = CreatesProject.new(name:"Project Runway")
      creator.build
      expect(creator.project.name).to eq("Project Runway")
    end
  end
{% endhighlight %}

The test fails because there is no `CreatesProject` object. To pass the test the following  class must be added.

{% highlight ruby %}
  #inside the app/workflows/creates_projects.rb
  class CreatesProject
    attr_accessor :name,:project

    def initialize(name="")
      @name = name
    end

    def build
      self.project = Project.new(name: name)
    end

  end
{% endhighlight %}

### What does the `CreatesProject` class do?

The following diagram shows the workflow of Creates Project Class.

<img class='img-responsive' src="/img/creates_project_diagram.png">

Notice that the `CreateProject` class has the build method which calls its `project` method because the `CreatesProject` class has an instance variable which is an instance of the `Project` class.


### Now what should be tested about `CreatesProject`?

Now that is clear what the class must do we must test out different cases. The following are some cases:
  * When the user enters a project name and one task with a size.
  * When the user enters a project name and one task with ~~no~~ size.
  * When the user enters a project name and one task with size 0.
  * When the user does not enter a project name and one task.
  * When the user enters a project name and multiple tasks.

The following are negative cases:
  * When the user enters a negative number as string size.
  * When the user does not enter any size for string size.
  * When the user enters a word for string size instead of entering an integer.

These are the tests:

{% highlight ruby %}
  #inside spec/workflows/creates_project_spec.rb
  require 'rails_helper'

  RSpec.describe CreatesProject do
    describe "initialization" do
      it 'creates a project given a name' do
        creator = CreatesProject.new(name: "Project Runway")
        creator.build
        expect(creator.project.name).to eq("Project Runway")
      end
    end

    describe 'string parsing' do
      it "creates project with empty task string" do
        creator = CreatesProject.new(name: "Project Runway",task_string: "")
        tasks = creator.convert_string_to_tasks
        expect(tasks).to be_empty
      end

      it 'creates project with task string but no size' do
        creator = CreatesProject.new(name: "Project Runway",task_string: "This is the first task")
        tasks = creator.convert_string_to_tasks
        expect(tasks.size).to eq(1)
      end

      it 'creates project with task string with arbitrary size' do
        creator = CreatesProject.new(name: "Project Runway",task_string: "This is the first task:2")
        tasks = creator.convert_string_to_tasks
        expect(tasks.first).to have_attributes(title: "This is the first task", size: 2)
      end

      it 'creates project with task string with size zero' do
        creator = CreatesProject.new(name: "Project Runway",task_string: "This is the first task:0")
        tasks = creator.convert_string_to_tasks
        expect(tasks.first).to have_attributes(title: "This is the first task", size: 1)
      end

      it 'creates project with task string with malformed size' do
        creator = CreatesProject.new(name: "Project Runway",task_string: "This is the first task:two")
        tasks = creator.convert_string_to_tasks
        expect(tasks.first).to have_attributes(title: "This is the first task", size: 1)
      end

      it 'creates project with task string with negative size' do
        creator = CreatesProject.new(name: "Project Runway",task_string: "This is the first task:-1")
        tasks = creator.convert_string_to_tasks
        expect(tasks.first).to have_attributes(title: "This is the first task", size: 1)
      end

      it "handles multiple tasks" do
        creator = CreatesProject.new(name: "",task_string: "First Task:2\nSecond task:3")
        tasks = creator.convert_string_to_tasks
        expect(tasks).to match([an_object_having_attributes(title: "First Task",size: 2),an_object_having_attributes(title: "Second task",size: 3)])spec/workflows/creates_project_spec.rb
      end


    end
  end

{% endhighlight %}

### Failure testing at Unit instead at system level

Notice that for the failure cases we did not have integration tests like the following:


{% highlight ruby %}
  #inside the /spec/system/add_project_spec.rb file
  #leaving out the string under the task string
  RSpec.describe "adding a new project without a string", type: :system do
      it "allows a user to create a project with tasks" do
        visit new_project_path
        fill_in "Name", with: "Project Runway"
        fill_in "Tasks", with: "" # leaving out the string
        click_on("Create Project")
        visit projects_path
        expect(page).to have_content("Project Runway")
        expect(page).to have_content(8)
      end

  end
{% endhighlight %}

Instead the author suggests testing failure cases at the unit level, for example, at the level of `CreatesProject`. This makes sense since system tests take much resources to run and can take much time.

Notice the introduction of the `RSpec` methods: `have_attributes`,`match`, and `an_object_having_attributes`.

### Changes to the `CreatesProject`class
{% highlight ruby %}
  #inside app/workflows/creates_projects.rb

  class CreatesProject
    attr_accessor :name,:project,:task_string

    def initialize(name: "",task_string: "")
      @name = name
      @task_string = task_string
    end

    def build
      self.project = Project.new(name: name)
      project.tasks = convert_string_to_tasks
      project
    end


    def create
      build.save
    end

    def convert_string_to_tasks
      task_string.split("\n").map do |one_task|
        title,size = one_task.split(":")
        Task.new(title: title, size: size_as_integer(size))
      end
    end

    def size_as_integer(size)
      return 1 if size.blank?
      [size.to_i,1].max
      #note that when a string is tried to be converted to integer the result is 0 if conversion not possible
    end

  end
{% endhighlight %}

The changes are centered on the `convert_string_to_tasks`method which incorporates the `size_as_integer`method. The `size_as_integer`method returns size `1` if the user did not enter a size or entered a negative number.

Running `rspec` on the `CreatesProject` should have all the tests passing.

### Unit Testing the `CreatesProject` object

How would you be able to test for failure without writing a resource intensive system test? One way is to analyze the points of failure and notice if any of such points involve an object that could be tested in isolation.

An example is the `CreatesPrject` workflow object given that a name is not written. First remember that as part of the design each Project object must have a name and thus an instance of the `Project` object can not be saved without a name. In order to achieve such validation in the `Project` model object, write the following code:
{% highlight ruby %}
  class Project < ApplicationRecord
  validates :name, presence: true
  #...
  end
{% endhighlight %}

With this change, Rails will not save the instance of a project object that does not have any name. The `CreatesProject` builds a project within the `build` method:

{% highlight ruby %}
class CreatesProject
  #...

  def build
    self.project = Project.new(name: name)
    project.tasks = convert_string_to_tasks
    project
  end

  def create
    build.save
  end

end:smile:
{% endhighlight %}


Notice that if the project saves the `create` method will return true, otherwise it will return false. The author suggests having a `success` method within the `CreatesProject` object so that the following test could be written within `creates_project_spec.rb`.


{% highlight ruby %}
  describe 'failures states' do
    it 'fails when there is no name' do
        creator = CreatesProject.new(name: "",task_string: "First Task:2\nSecond task:3")
        creator.create
        expect(creator).to_not be_a_success

    end
  end
{% endhighlight %}

This fails if there is no `success` method.

{% highlight ruby %}
class CreatesProject
 #add to attr_accessor :success
 #also add within the initialize method @success and set it equal to false. False is the default
  #...

  def success?
    build
  end

  def create
    success = build.save
  end

{% endhighlight %}

## All tests now pass

Before finishing this long reminder post, note that the author talked about many other valuable tips and tricks. However, I chose to only highlight what I thought was more relevant to `me`.
