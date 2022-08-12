---
title: Introduction to Linked List
date: 2022-08-12T00:00:00.644Z
excerpt: A beginner friendly introduction on Linked List with an Example on Python.
type: post
blog: false
dataStructureSeries: true
order: 1
image: /images/ds/big-o-cover.jpg
tags:
  - Python
  - DataStructure
  - ProblemSolving
  - Beginner
  - GetReady
---

## Introduction
Link list is a linear dataset where data are not stored sequentially on the memory. Unlike array link list consist of value and next pointer. This is how we can determine where to go in next. Simply the iteration each after each.

### Pros
* **Dynamic Data Structure**. Linked list is a dynamic data structure so it can grow and shrink at runtime by allocating and de-allocating memory. So there is no need to give initial size of linked list. Some of the high level language has this feature in the array like Python's list.
* **Insertion and Deletion**. Unlike array link list is very easy to remove and add new value. Array needed to shift all the remaining items. But in link list we just need to update the pointer.
* **No Memory Wastage**. As link list is dynamic. So, we don't have to declare a size for it.

### Cons
* **Memory Usage**. More memory is required to store elements in linked list as compared to array. Because in linked list each node contains a pointer and it requires extra memory for itself.
* **Traversal**. Elements or nodes traversal is difficult in linked list. We can not randomly access any element as we do in array by index. For example if we want to access a node at position n then we have to traverse all the nodes before it. So, time required to access a node is large.
* **Reverse Traversing**. In linked list reverse traversing is really difficult. In case of doubly linked list its easier but extra memory is required for back pointer hence wastage of memory.

### Example
* Initialize the Linked list
* Append item at beginning
* Append item at the end
* Append item at middle with a position/count after
* Reverse the linked list
* Print the linked list items as a list/array

```python
from typing import List


class Node:
    def __init__(self, data: str | int | float) -> None:
        self.value = data
        self.next = None


class LinkedList:
    def __init__(self, array: List[str | int | float]) -> None:
        """
        Here we'll define the linked list from the array/list provided in contructor.
        So, Let's do it.
        """
        arr_len = len(array)
        self.head = Node(data=array[0])
        _next = self.head.next
        for index in range(1, arr_len):
            if _next is None:
                _next = Node(data=array[index])
                self.head.next = _next
            else:
                _next.next = Node(data=array[index])
                _next = _next.next

    def print_as_list(self) -> List[str | int | float]:
        """
        Traverse the linked list and print as list
        """
        _data = []
        _head = self.head
        while True:
            _data.append(_head.value)
            _head = _head.next
            if _head is None:
                break
        print(_data)
        return _data

    def insert_at_beginning(self, value: str | int | float) -> None:
        """
        This function insert an item to the beginning of the linked list.
        """
        new_node = Node(data=value)
        new_node.next = self.head
        self.head = new_node

    def insert_at_ending(self, value: str | int | float) -> None:
        """
        This function insert an item to the ending of the linked list.
        """
        new_node = Node(data=value)
        _head = self.head
        while _head.next is not None:
            _head = _head.next
        _head.next = new_node

    def insert_at_middle(self, value: str | int | float, insert_after: int) -> None:
        """
        This function insert an item to the middle of the linked list.
        insert_after is a position of iteration. IT'S NOT THE VALUE.
        """
        new_node = Node(data=value)
        _head = self.head
        iteration = 1
        while _head.next is not None:
            if iteration == insert_after:
                new_node.next = _head.next
                _head.next = new_node
            iteration += 1
            _head = _head.next

    def reverse_the_linked_list(self):
        """
        We are going to reverse the linked list. Reversing the linked list is just changing the pointer.
        We don't need to reshuffle the memory and addresses.
        """
        _head = self.head
        previous = None
        while _head is not None:
            temp = _head.next
            _head.next = previous
            previous = _head
            _head = temp
        self.head = previous


def main():
    linked_list = LinkedList(array=[1, 4, 3, 5, 7, 9, 2])
    linked_list.print_as_list()
    linked_list.insert_at_beginning(value="TEST")
    linked_list.print_as_list()
    linked_list.insert_at_ending(value="END")
    linked_list.print_as_list()
    linked_list.insert_at_middle(value="MID", insert_after=2)
    # Output should be ['TEST', 1, 'MID', 4, 3, 5, 7, 9, 2, 'END']
    linked_list.print_as_list()
    linked_list.reverse_the_linked_list()
    linked_list.print_as_list()


if __name__ == "__main__":
    main()

```

**Practice Problems :** [LeetCode's Linked List Problems](https://leetcode.com/tag/linked-list/)
