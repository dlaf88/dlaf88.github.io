---
title: Lessons and Reminders from building a Rails CMS. (Part 1)
layout: blog_post
categories: 
topic: Tech
tags: Rails 
---

I am currently trying to improve my development skills. I finished the Bloc.io bootcamp in the spring of 2015 and although I did learn a great amount of material through Bloc, I want to continue leveling up my skills.

In order to improve my skills, I decided to build various projects by finding interesting blog posts from Rails developers. In my search, one blog post caught my attention:  [How to Build a CMS in Ruby on Rails](https://pchm.co/posts/tutorial-how-to-build-a-cms-in-ruby-on-rails), by Piotr Chmolowski. Piotr explains that the aim of his post was not to show his audience how to reinvent the CMS wheel. After all, there are various gems that provide great solutions for those looking for a CMS in Rails (e.g. Refinery CMS). Piotr explains, that the aim of his blog post was to show the process of building a CMS from scratch by focusing on defining problems and solutions in simplest terms. 

### Piotr's post was full of useful reminders and lessons for Rails developers.

Building Piotr’s CMS proved to be a great exercise.  I learned some new material and was reminded of some Rails and Ruby lessons. The following blog post details some of those lessons and reminders.

<br>

## 1. A Rails Engine is a ‘mini application’

The CMS, named Wellspring by Piotr, was built as a  rails engine. This means that it acts like a small Rails app; for example, Wellspring has its own controller, routes, models, etc. The point of making Wellspring an engine (rather than Rails app) was to make in modular so that it could be mounted to any existing Rails app. 

The process of building an engine called Wellspring is as easy as writing : 

{% highlight bash %}
$ rails plugin new wellspring --mountable --database=postgresql --skip-spring --skip-turbolinks
{% endhighlight %}

This is how to mount Wellspring into an existing app  :

{% highlight ruby %}
# blog: Gemfile ## this assumes you have an app called blog
gem 'wellspring', path: '../wellspring/'
{% endhighlight %}
 
Remember to install migrations and setup the DB.
{% highlight bash %}
$ rake wellspring:install:migrations
$ rake db:create
$ rake db:migrate
{% endhighlight %}

``Reminder:`` When using an Engine in an app, Rails automatically creates and namespaces the database tables (in the main app) by using the engine’s name. For example, an Entry Model (``` class Entry::Wellspring ```) would be created in your main app’s DB as  ``` wellspring_entries ```.

<b>Takeaway:</b> Rails engines are mini apps and are useful to create code that will be reused in other apps.

## 2. STI, Postgres JSON columns, and the use of dynamics methods allow for the creation of flexible models. 

A CMS might need a blog post model today only to later need a photo gallery model or a blog link model in the future. It might seem like a good idea to create models like BlogPost, PhotoPost, BlogLink each with their own database table. However, Piotr decided to create a “catch-all” model called Entry. Other models such as BlogPost or BlogLink could inherit from Entry with the help of Single Table Inheritance(STI). Piotr used (STI) in order to add custom data and behavior to the child classes of Entry. 

STI is (relatively) easy to apply in Rails -- for more information on STI check out this [blog post](http://eewang.github.io/blog/2013/03/12/how-and-when-to-use-single-table-inheritance-in-rails/).

The following is the ```class Entry``` as presented by Piotr.

{% highlight ruby  %}

# wellspring: app/models/wellspring/entry.rb
module Wellspring
  class Entry < ActiveRecord::Base
    scope :published, -> { where('published_at <= ?', Time.zone.now) }

    def self.content_attr(attr_name, attr_type = :string)
      content_attributes[attr_name] = attr_type

      define_method(attr_name) do
        self.payload ||= {}
        self.payload[attr_name.to_s]
      end

      define_method("#{attr_name}=".to_sym) do |value|
        self.payload ||= {}
        self.payload[attr_name.to_s] = value
      end
    end

    def self.content_attributes
      @content_attributes ||= {}
    end
  end
end
{% endhighlight %}

{% highlight ruby %}
  class BlogPost < Entry::Wellspring
  ...

  end 
{% endhighlight %}

``Reminder:`` With the use of STI, in the database all instances of BlogPost are technically instances of  Entry with a “type” equal to BlogPost. However Rails makes it easy to access a BlogPost instance simply by writing ```BlogPost.find(1)``` instead of writing ``Entry.where(id: 1, type: 'BlogPost')``.

### Postgres JSON column

It is highly likelt that a ```BlogPost``` class contains different attributes than a ```PhotoPost``` class. But, if both BlogPost and PhotoPost inherit from the model Entry, where in the database are the different attributes contained? 

``Reminder:``The different types of data are contained in a payload column which has a JSON type. Because Postgres allows us to natively use JSON columns, we could add an arbitrary number of attributes to a child class of Entry via the payload column.

For example,  I could have  a PhotoPost model with the attributes photo_url, title, context, etc. An instance of the PhotoPost class could return the following values.

{% highlight ruby  %}
photo_post = PhotoPost.last
photo_post.payload 
#returns
 {photo_url: 'www.amazon.com/example.jpg',
   title: 'this is an awesome title photo post',
   context: 'this is the context of the article'
}


{% endhighlight %}

``Reminder:`` It could be the case``BlogPost`` and ``PhotoPost`` contain vastly different attributes but the Blog Post instances and the Photo Post instances are still both instances of ``Wellspring::Entry``.

### Dynamic methods allow us to get and set the payload attributes.

Notice that ```photo_post.payload``` returns JSON data as a hash. In our example above, to return the value of the photo_url, we would need to write ```photo_post.payload[‘photo_url’]```. This is not the Rails way; we are used to reaching our attributes through familiar rails interfaces (eg photo_post.photo_url). 

In order to produce the same interface, Piotr uses a class method  called ```content_attr``` to allow the creation of getters and setters for particular payload attributes. For example ```content_attr :photo_url, :string``` would allow us to use the following.
{% highlight ruby  %}
 photo_post.photo_url #=>  'www.amazon.com/example.jpg'
# return 
{% endhighlight %}

It is important to note that although ```content_attr``` is a class method,  ```content_attr``` uses ```define_method``` to create the instance methods. This use of code was a great reminder of ruby's metaprogramming capabilities. 

``Reminder:`` Rails, Ruby, and Postgres provide much flexibility. In the past, I created different models each with their own database table without first reflecting on whether another approach was posssible. Piotr's CMS post reminds us to look for alternative solutions in bulding an app's model architecture.
<br>

## 3. The scope method in Routes can be used to provide contextual information to the Controller.

In order to have a single interface for all types of content, Piotr uses only an ```EntriesController```: Piotr does NOT have a ```BlogPostsController``` or ```BlogLinksController```. Moreover, he uses the method ```content_class``` to provide ```EntriesController``` the information needed to work with the correct type of content. 

{% highlight ruby  %}
#Inside EntriesController in Wellspring Engine

def content_class
  @content_class ||= params[:content_class].classify
end
helper_method :content_class

{% endhighlight %}

Notice that the method ```content_class``` expects the params hash to have ```:content_class```. For this reason, inside the routes file, Piotr added:

{% highlight ruby  %}
# wellspring: config/routes.rb
Wellspring::Engine.routes.draw do
  scope "/:content_class" do
    resources :entries
  end
end
{% endhighlight %}

With the aid of the scope method the Entries Controller is able to tell the difference between ```/admin/blog_posts/entries/``` and ```/admin/blog_links/entries/```. 

```Reminder:```Rails routes provides methods which may give contextual information to Controllers. Such methods are a great tool in building a flexible model architecture. 


<hr>

There are many more lessons and reminders worth exploring. Stayed tuned for other editions of <b>Lessons and Reminders from building a Rails CMS.</b>











