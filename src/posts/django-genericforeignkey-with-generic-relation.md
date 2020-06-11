---
title: Django GenericForeignKey with GenericRelation
date: 2020-05-18T00:00:48.644Z
excerpt: What is GenericForeignKey and How to use it properly with GenericRelation
image: /images/django-unchained.jpg
type: post
blog: true
tags:
  - python
  - django
  - orm
  - webdev
  - query

---
## Introduction
I hope it's no offense that, Django is a powerful tool for the web. Today I'll talk about `GenericForeignKey` and `GenericRelation`. End of the article you will know about `GenericForeignKey` and `GenericRelation`.

## What is GenericForeignKey?
`GenericForeignKey` is a foreign key with any model with the help of content type. Still confusing? Let's see some example.

Suppose we have book system where there are some models like following,

```python
class Author(models.Model):
    name = models.CharField(max_length=64)
    # Other fields


class Reader(models.Model):
    name = models.CharField(max_length=64)
    # Other fields


class ActivityLog(models.Model):
    # Here we want to track everything that other users do. So, I'll add GenericForeignKey
    content_type = models.ForeignKey(
        ContentType, default=None, null=True, on_delete=models.SET_NULL, related_name='activity_logs')
    object_id = models.BigIntegerField(default=None, null=True)
    object = GenericForeignKey(ct_field="content_type", fk_field="object_id")
    # Other fields
```

* Here `content_type` is the FireignKey relation with django content type model. If you want to know more about content type framework of Django then [https://docs.djangoproject.com/en/3.0/ref/contrib/contenttypes/#module-django.contrib.contenttypes](here it is).
* `object_id` is just a big integer field for holding the related object id.
* `object` is a relation for accessing the generic object. This field will not create column on database. It just model level mapping with the generic object.

### What we can do now?
**Data access:** We can access data using dot[.] operator like, 
```
>>> _log = ActivityLog.objects.first()
>>> _log.object
<Author object>
```

### What we can't do?
We won't query like `ActivityLog.objects.filter(object__name__contains='mr x')` on the ActivityLog model. But this is not impossible. Here comes `GenericRelation`.

## How to use GenericRelation with GenericForeignkey?
Just need to modify a little bit of our models(those models need to access over queryset.). Let's do it.
```python
class Author(models.Model):
    name = models.CharField(max_length=64)
    # This will not create field on db
    activity_logs = GenericRelation(ActivityLog ,content_type_field='content_type',
        object_id_field='object_id', related_query_name='author')
    # Other fields


class Reader(models.Model):
    name = models.CharField(max_length=64)
    # This will not create field on db
    activity_logs = GenericRelation(ActivityLog ,content_type_field='content_type',
        object_id_field='object_id', related_query_name='reader')
    # Other fields

```

That's it. We can now write like following...

```
>>> ActivityLog.objects.filter(author__name__contains='mr x')  # This is for author.
>>> ActivityLog.objects.filter(reader__name__contains='mr x'). # This is for reader.
```

Hope this helps.