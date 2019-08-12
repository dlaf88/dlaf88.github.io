---
title: Rails Engines workshop.
layout: blog_post
categories: 
topic: Tech
tags: Rails 
---


Hello, future me, I'm writing this post to remind you how rails engines work.



### A Rails App is a Super-Charged Engine


You start with a host application: such app can be your run-of-the-mill blogging application. You then add another application to add functionality. When you think of a rails engine you should think of Devise and Thredded. Thredded, for example, allows the main application to use forums.

According to the Rails docs, a rails app inherits "a lot of its behaviour" from Rails::Engine.

<br>

### Different types of Engines

The engine is related to the ```plugin```. In fact, to build an engine you have to type ```rails new plugin name-of-engine --full```. Plugins can be engines and engines can be plugins.

### So what is the difference?





