---
layout: page
title: Essays
permalink: /essays/
---

{% assign essays_by_competition = site.essays | group_by: "competition" %}

{% for group in essays_by_competition %}
## {{ group.name }}

<ul>
  {% for essay in group.items %}
    <li>
      <a href="{{ site.baseurl }}{{ essay.url }}">{{ essay.title }}</a>
      {% if essay.year %} ({{ essay.year }}){% endif %}
    </li>
  {% endfor %}
</ul>
{% endfor %}
