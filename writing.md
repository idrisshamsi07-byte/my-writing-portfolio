---
layout: page
title: Writing
---

These articles are examples of my journalistic writing, focusing on technology, science, and society.

---

{% for post in site.posts %}
- **[{{ post.title }}]({{ post.url }})**  
  {{ post.description }}
{% endfor %}
