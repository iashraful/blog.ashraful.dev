---
title: Docker for Local Development
date: 2020-01-11T00:00:00.644Z
excerpt: This will teach you how to containerize you application/services and setup development environment.
type: post
blog: true
image: /images/docker-compose.png
tags:
  - DevOps
  - Docker
  - docker-compose
  - localhost
  - development

---

> Are we already know about [Docker](https://www.docker.com/). If not please read this ([Docker Into](https://ashraful.dev/posts/introduction-to-docker.html)) first.

## Why should I use Docker in local development?

Do you like to spent more time to setup your environment? If yes? just close the window. Maybe you are not in the right place. Okay no more gossiping. Let me tell you a real story.  

Recently I have bought a MacBook for my personal development. I was exited to write code on it. But before that I must setup my development environment to start with it. So, without delaying I started cloning repositories from Github and then installing their dev dependencies. Seriously at the end of the day I was damn tired of doing this. One of my pet project was using Node(v8.10.*), MongoDB and React. Another projects have latest version of Node and other dependencies. So I was on trouble setting up my environment as I was new at Mac OS. So, finally I had decided to write `Dockerfile` at all my services and `Docker Compose` to run them together.

## What is Docker Compose?

Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. More details [here](https://docs.docker.com/compose/).

## An Example Architecture

Suppose, we have two different services and one database service. 
1. NodeJS app
2. React app
3. MongoDB

We are going to write `docker-compose.yml` file and run them with single command anytime and anywhere. As I am not going to explain the code part rather than `docker` and `docker-compose`, So, I already have an app with this architecture. Fork and clone the app from [github](https://github.com/iashraful/graphql-mongo-todo) and change on your own.
