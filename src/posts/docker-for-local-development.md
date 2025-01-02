---
title: Docker for Local Development
date: 2020-01-11T00:00:00.644Z
excerpt: This will teach you how to containerize your application/services and setup development environment.
type: post
blog: true
image: /images/docker-compose.png
tags:
  - DevOps
  - docker
  - docker-compose
  - localhost
  - development

---

> Are we already know about [Docker](https://www.docker.com/)? If not please read this ([Docker Into](https://ashraful.dev/posts/introduction-to-docker.html)) first.

## :question: Why should I use Docker in local development?

Do you like to spend more time to setup your environment? If yes? just close the window. Maybe you are not in the right place. Okay no more gossiping. Let me tell you a real story.  

Recently I have bought a MacBook for my personal development. I was exited to write code on it. But before that I must setup my development environment to start with it. So, without delaying I started cloning repositories from Github and then installing their dev dependencies. Seriously at the end of the day I was damn tired of doing this. One of my pet project was using Node(v8.10.*), MongoDB and React. Another projects have latest version of Node and other dependencies. So I was on trouble setting up my environment as I was new at Mac OS. So, finally I had decided to write `Dockerfile` at all my services and `Docker Compose` to run them together.

## :question: What is Docker Compose?

Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. More details [here](https://docs.docker.com/compose/).

## :dizzy: An Example Architecture

Suppose, we have two different services and one database service. 
1. NodeJS app (port: 5000)
2. React app (port: 5001)
3. MongoDB (port: 27017)

We are going to write `docker-compose.yml` file and run them with single command anytime and anywhere. As I am not going to explain the code part rather than `docker` and `docker-compose`, So, I already have an app with this architecture. Fork and clone the app from [github](https://github.com/iashraful/graphql-mongo-todo) and change on your own.

As you already have seen we are going to run all these services/applications in different ports, So, we need to allow these ports in container and physical machine(your machine). For example, If you already mongo installed on your computer then you may not use `27017` port for new mongo container. So, what we can do, we can forward the port from docker container to physical machine. It's simple as you think.

## :rocket: Let's setting it up

* Clone the repo, `git clone https://github.com/iashraful/graphql-mongo-todo.git`
* `cd graphql-mongo-todo`
* Open `docker-compose.yml` with your favorite editor. (Don;t worry I'll explain. :sunglasses:). You'll see similar like following.

#### `docker-compose.yml`
```yml
version: '3.5'
services: 
  react_client:
    build: ./client
    command: sh -c "yarn install && yarn start"
    environment: 
      - NODE_ENV=development
      - PORT=5001
    ports:
      - '5001:5001'
    working_dir: /app/client
    volumes:
      - ./client:/app/client:cached

  node_server:
    build: ./server
    command: sh -c "yarn install && yarn dev"
    environment: 
      - NODE_ENV=development
      - PORT=5000
    ports:
      - '5000:5000'
    working_dir: /app/server
    volumes:
      - ./server:/app/server:cached
    depends_on: 
      - mongodb

  mongodb:
    image: mongo
    expose:
      - '27017'
    environment: 
      - MONGO_INIT_DB_DATABASE_NAME='graphql-todo'
    volumes: 
      - ./db:/data/db
    ports:
      - '27019:27017'

```

#### version: '3.5'
This version indicates that, which docker engine version you are using. In my case I am using most recent docker engine 19.\*.\*. So, I am using version 3.7. See [full versioning guide](https://docs.docker.com/compose/compose-file/compose-versioning/)

#### services
It's plain and simple. How many services you want to run using this compose file. Mine is three. Node, React, Mongo.

#### react_client, node_server, mongodb
Name of each service. Under each service you need to specify the configuration.

#### build: [directory path]
Which directory you are going to use for the particular services. You can specify the relative path here.

#### command: [Any shell command]
Command is fully depends on the image that you have chosen. If you pick an image that is based on linux then you know the bash is default shell. So, without any worrying you can use bash command. **If you are confused about the image that I've chosen here? Don't worry I'll talk about it.**

#### environment
Any kind of environment variable you can pass through the `environment`.

#### ports
This is important to know how to enable port for container and map the physical machine port. Here `5000:5000` means `Container port:Physical machine port`.

#### working_dir
It's straightforward path of container where your code will be copied.

#### volumes
Volumes is most important to know when you are on local development. Because you don't like to re-build and run the container after every change. So, It creates a mapping between physical machine code vs container working directory codes.

#### depends_on
It's an awesome feature we have. Suppose you have five services and one service depends on other. Like our nodejs service depends on mongodb. So, I put `depends_on: mongodb`

#### image
Image is the docker image that we are using as a base image. As we already know from our [previous post](https://ashraful.dev/posts/introduction-to-docker.html) that, **Every docker must have a base image.**. This is the image tag we can use for defining the image. If you look closely, I didn't define image at `react_client` and `node_server`. But on mongo I defined `image: mongo`. Do you know why?? Let's see why.

## :question: Can't we use `Dockerfile`?
**Yes we can.** Open client and server directory, you'll see Dockerfile is there. Even when you command your computer to runt the docker compose file then, your computer find the build directory and find a dockerfile inside it. Then execute as it is.

## :dog: Oh Enough :bomb: Let's run the project.
* Open up your terminal/console.
* `$ docker-compose up`
* Wait few moments and enjoy.

## :snowman: Basic `docker-compose` commands.
* `docker-compose up` :arrow_right: Run the docker compose file.
* `docker-compose up --build` :arrow_right: Re build and run the docker compose file.
* `docker-compose up <service name>` :arrow_right: Up and running a specific services.
* `docker-compose start` :arrow_right: Start the last built containers.
* `docker-compose stop` :arrow_right: Stop the last running containers.
* `docker-compose restart` :arrow_right: Restart the last running containers.
* `docker-compose logs -f <service name>` :arrow_right: Log from a specific service.
* `docker-compose exec <service name> bash` :arrow_right: SSH into a particular container bash.

:triangular_flag_on_post: That's all. Thanks for reading! :laughing: