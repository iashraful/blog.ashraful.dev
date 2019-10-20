---
title: Plug and Play GraphQL with Django
date: 2019-07-23T02:39:48.644Z
excerpt: Making GraphQL API on Django with minimal configuration. 
type: post
blog: true
tags:
  - graphql
  - api
  - server-side
  - webdev
  - django
  - python

---

### [Github (pnp-graphql) v0.0.1-beta](https://github.com/iashraful/pnp-graphql)
> A library for making GraphQL API with Python/Django. This is like a flash drive, just how you plug into computer and transfer files.

#### What is pnp-graphql?
The tiny library is for making GraphQL in a minute. It considers models based approach. For example, Your app has few models like **Book**, **Author**, **Publication** etc. Now this library will enabled a GraphQL API for all those models. You can do query, mutation on API.  

**Example Query for "Book"**
```
query getBooks {
  bookList(limit: 500, name: "Honey") {
    id
    name
    publication {
      id
      name
    }
    authors {
      id
      name
      address
    }
  }
}

```
**Example Create Mutation for "Book"**
```
mutation CreateNewBook{
  createbook(input:{
    name: "GraphQL the awesomeness of API development",
    authors: [1,7],
    publication: 103
  }) {
    book{
      id
      name
      authors{
        id
        name
      }
      publication {
        id
        name
      }
    }
  }
}
```
**Example Update Mutation for "Book"**
```
mutation updateBook{
  updatebook(id:2, input:{
    name: "Hello Honey Bunny??"
    authors: [1,2,3]
  }) {
    book{
      id
      name
      publication{
        name
      }
      authors {
        id
        name
      }
    }
  }
}
```
**Example Delete Mutation for "Book"**
```
mutation deleteBook{
  deletebook(id: 500){
    book
  }
}
```

#### Quick Start
> Documentation is coming soon...

* Install from pip `pip install pnp-graphql`
* Add PnP GraphQL config on settings.
```python
GRAPHENE = {
    'SCHEMA': 'pnp_graphql.schema.schema'
}

PNP_GRAPHQL = {
    'ENABLED_APPS': ['example_app']
}
```
* Set `DEBUG = False` for production use.

**That's it :)**  
**Now visit:** *http://your-ip:port/api/graphql-explorer/* for explore GraphQL built-in UI explorer for query.  
**Production ready API :** *http://your-ip:port/api/graphql/*


#### What's working?
* GraphQL query
* Mutation (Create, Update, Delete)
* Pagination
* API filtering for Number, String, Date, DateTime

#### What are the plans?
* Authentication
* Proper error handling
* Field validation
* Caching
* many more ... ... ...

**Contributors are most welcome :)**