---
title: TDD and chapter 3
layout: blog_post
categories:
topic: Tech
tags: Rails Testing
---

## Where we left off

The objective of the last chapter was to test `Project` and `Task` objects which through TDD passed their respective tests. The `Project` objects could calculate the estimated time of completion based on the velocity rate of completed tasks. We also had `Task` objects that had functions such as `marked_completed`.


### On to the task at hand

The task at hand now involves thinking about requirements. The author of the book state that the following a user in the project must be able to the do the following:

1. A user can enter a task, associate it with a project, and also see it on a project page.
2. A user can create a project and seed it with tasks using the `task name:size`
3. A user can mark as complete a task.
4. A project can display its progress.


Remember that the author started the TDD process thinking about the main object and what it had to do. The first test involved the `project.done?`. Here we are talking about requirements that a user must do in order use the app. The following tests involve the concept of Outside-in testing. Such tests are considered outside-in because it involves testing a feature "the outside" and augmenting it with unit tests that drive the inside "inside tests".

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

This code tells rails how run end-to-end system tests.


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

`bundle exec rspec` now causes errors related to the filling of the form because Rails expects a related view template.



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
