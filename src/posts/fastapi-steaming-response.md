---
title: FastAPI Steaming Response
date: 2022-05-09T10:39:48.644Z
excerpt: Steaming response is a way to respond user continuously. Today we will learn how to properly use the steaming response.
type: post
blog: true
image: /images/fast-api-cover.png
tags:
  - python
  - fastapi
  - steam

---
## What is Testing:question:
Testing is basically checking the features are okay or not and finding bugs on the system. Basically, there are many types of testing we do with software. Today we will talk about the most famous unit testing process. Let's keep going.

## What is a unit testing:question:
A unit test is a way of testing a unit - the smallest piece of code that can be logically isolated in a system. In most programming languages, that is a function, a subroutine, a method or property.

## Python's builtin unittest :boom:
Let's try some functions and their unit tests
```python
# test_add.py
# A very basic function for adding two numbers
def add(a: int, b: int) -> int:
    return a + b

# Writing Unit Test
import unittest

class TryingTheAwesomeUnitTest(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(5, 7), 12)

if __name__ == '__main__':
    unittest.main()
```

Save the file as `test_add.py` and run the file `python3 test_add.py` and see the following output.
```
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

## Introduction to PyTest :rocket:
> [pytest](https://docs.pytest.org/): helps you write better programs

Pytest is another testing library for Python. Let's dig into it.

### Installation:bulb:
```
pip install pytest
```

```python
# test_2_add.py

# The same old function
def add(a: int, b: int) -> int:
    return a + b

def test_add():
    assert add(3, 5) == 9 # I want see the fail response
```

### Run the tests:bug:
Just type `pytest` on the directory where you have saved the file.
```
$ pytest
```

### Result:see_no_evil:
```
============================================ test session starts =============================================
platform darwin -- Python 3.8.1, pytest-6.2.4, py-1.10.0, pluggy-0.13.1
rootdir: /Users/ashraful/Public/scripts
collected 1 item

test_2_add.py F                                                                                        [100%]

================================================== FAILURES ==================================================
__________________________________________________ test_add __________________________________________________

    def test_add():
>       assert add(3, 5) == 9 # I want see the fail response
E       assert 8 == 9
E        +  where 8 = add(3, 5)

test_2_add.py:8: AssertionError
========================================== short test summary info ===========================================
FAILED test_2_add.py::test_add - assert 8 == 9
============================================= 1 failed in 0.04s ==============================================
```

**Tips:** Don't forget to put the filename `test_` as prefix otherwise pytest can't detect the file. Whatever `test_` as prefix is mandatory convention for test case.