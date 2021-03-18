---
title: Introduction to API Gateway
date: 2021-02-07T09:57:48.644Z
excerpt: An API Gateway is the abstraction layer between client and microservices.
image: /images/API-Gateway.png
type: post
blog: true
tags:
  - microservices
  - apigateway
  - systemdesign
  - api

---
## :bulb: What is an API Gateway:question:
An API gateway is an API management tool that sits between a client and a collection of backend services.

An API gateway acts as a reverse proxy to accept all application programming interface (API) calls, aggregate the various services required to fulfill them, and return the appropriate result.
**In short:** An API Gateway is the abstraction layer between client and microservices.

## :fire: When to use an API Gateway:question:
Let's imagine that you are building a native mobile application for android and ios. In that case, you have two teams to develop the apps. On the backend side, you have separate services like Auth, Product, Cart, Order, etc. And you perfectly deploy the services. Let's assume the following IPs are assigned to services.
```
Auth     192.168.1.10
Product  192.168.1.11
Cart     192.168.1.12
Order    192.168.1.13
```
Now you tell your app team to call API according to the services' IP/Domain. Okay Good. Your business is good.  
After some days you realized to separate the Order and Payment service. Your backend team finished the job. And now the painful part is releasing the app(Android, iOS) and make sure that everyone gets the update. Both teams need to work just to change the API URL. Not only that, problems like this can arise at any time. So, here is a simple solution is, "API Gateway".

## :tada: How an API Gateway is solving your problem:question:
We just talk about the problem. Now let's talk about the solution. We just need to check the request URI and pass the request to the respected service. For example:
```python
# Something like this.
if request_uri == '/api/login/':
   pass_the_request(auth_service)
```

There are lots of API gateways that are already written for multiple purposes. For a small project, I'd like to use Nginx's reverse proxy. We'll talk about it later.
