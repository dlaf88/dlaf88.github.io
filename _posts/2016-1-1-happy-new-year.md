---
layout: blog_post
tags: Goals
topic: Life
---


{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tag_words = site_tags | split: ','| sort %}

{{tag_words}}

