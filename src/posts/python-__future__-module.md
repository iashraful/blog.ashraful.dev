---
title: Python __future__ module
date: 2020-05-18T00:00:48.644Z
excerpt: What is __future__ module and how it works.
image: /images/python-snake.jpg
type: post
blog: true
tags:
  - python
  - builtin
  - modules
  - functional

---
## :question: What is __future__ module btw?
* __future__ is python built-in module.
* It serves three purposes, 
* To avoid confusing existing tools that analyze import statements and expect to find the modules they’re importing.
* To ensure future statements run under release prior to 2.1 at least yield runtime exceptions
* __future__ will allow you to use a feature from the future.

> I know it sounds crazy for the first time you heard. But it's real. Let's dig into this.

## :fire: More about __future__.
__future__ module introduced from python 2.1. On the source of cpython's `__future__.py` there is defined each future feature like following,
```python
FeatureName = _Feature(OptionalRelease, MandatoryRelease, CompilerFlag)
```
Where, normally, OptionalRelease is less than MandatoryRelease, and both are 5-tuples of the same form as sys.version_info
```
sys.version_info(major=3, minor=8, micro=1, releaselevel='final', serial=0)
```

## :collision: Okay! Enough talk. Let's see the usage.
Suppose, you are using python2(Though python 2 is dead. Just take it an example). You want to use the print function from python3. But how you can do it? Here comes the __future__ module.

Python 3 Console
```
>>>
>>> print('Hello', 'World', sep=', ', end='\n')
Hello, World
>>>
>>>
```

In python2 you need to do the following,
```
>>>
>>> from __future__ import print_function
>>>
>>> print('Hello', 'World', sep=', ', end='\n')
Hello, World
>>>
```
Here, I have imported print_fuction from __future__ module. Then it's working as expected from python3. I hope you got it.

## :flushed: Available future functions
`nested_scopes`
`generators`
`division`
`absolute_import`
`with_statement`
`print_function`
`unicode_literals`
`barry_as_FLUFL`
`generator_stop`
`annotations`

See the source [here](https://github.com/python/cpython/blob/3.8/Lib/__future__.py)

Good Luck :smiley: