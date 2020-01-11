---
title: Introduction to GraphQL
date: 2019-07-08T02:39:48.644Z
excerpt: A very basic and complete intro for beginners with props and cons.
type: post
blog: true
image: /images/graphql.png
tags:
  - graphql
  - api
  - webdev

---


## What is GraphQL?
**GraphQL** is a query language for API. It fulfils the client's need on runtime. It gives the client power to decide the API data format, dataset.

## History behind the awesome GraphQL
The awesome GraphQL was invented by **Facebook** in 2012. At that time Facebook internally used it. Later on, 2015 Facebook decided to make it open source. Now it's maintaining by GraphQL community.

## Props
#### * Single endpoint API service
GraphQL is capable of serving huge data in single endpoint. For example, you need a list of all users and all products of the system. In REST you need atleast two endpoint to achieve this. But in GraphQL it just in one API.
**A basic GraphQL query example:**
```graphql
query getCustomData {
  getUsers {
    name
    username
  }
  getProducts {
    name
  }
}
```

#### * Control data fetching
From the last example you already aware about data query. In GraphQL we can let server know what I really needed.
**Let's modify the query**

```graphql
query getCustomData {
  getUsers {
    name
    username
    email
    ... anything you have
  }
}
```

#### * Modern Design
GraphQL has very much modern design of API making. It helps development easy and less maintaining for different different client software. For example, You have a desktop client, a mobile client and a web client obviously for a product name "x". Mobile app doesn't need all the data that your web client and desktop client needed. In that case, either you needed to expose different API each client or serialize all the fields. Then, you one of the client will fetch extra/unnecessary data. Now think about very slow network. I hope you understand the pain of slow loading. So, the primary and smart solution is writing GraphQL API.


### Cons
#### * No built-in caching support
Unfortunately or fortunately GraphQL doesn't have caching support. As REST api have multiple endpoints. So, traditional http call caching works well. Unlike REST it has single endpoint to fetch data. Data depends on query. So, there is no way to cache from http request. 

#### * No specific error code
This is not a big issue. We can backdoor the problem. Unlike REST it doesn't have different error codes. It always returns 200. The way to indentify an error is the key `errors` in response data.


**Conclusion:** My personal opinion GraphQL is awesome, smart and modern. But don't use it unless you need it. 