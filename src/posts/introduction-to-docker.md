---
title: Introduction to Docker
date: 2019-10-21T00:00:00.644Z
excerpt: A beginner friendly docker introduction
type: post
blog: true
tags:
  - Docker
  - DevOps
  - beginner
  - container
  - kubernetes

---

## What is Docker?

**Docker** is a PaaS(Platform-as-a-Service) product that uses OS level virtualization to deliver a software as a package called container. Each containers are separated from each other and they bundled their own dependencies, but it's possible to communicate between two or more containers.


## Why Docker?

Before I start tell you the reason, I would like to share my own story. Once I worked for someone on a VueJS application. After finishing my development I was going to deliver him. And he asked me a favor to deploy the app for him. Then he gave me the credentials of his vps(MS Azure). I thought it'll be easy to do it as I did that before. So, without thinking I just logged into server with ssh and start deploying the application in traditional process. After sometimes I realized **Node** version is 4.*. Which is very low for my application. So, I updated the node version and then I was on real trouble. Because client already had a nodejs backend application hosted on that machine with 4.\* node version. So quickly I had to downgrade the node version. Then I googled million times about different node version. I found **NVM(Node Version Manager)**. I deploy the VueJS application with nvm. But I wasn't convince. After some days I read about **Docker**. And it sounds pretty awesome to me.  

Come to the point, **Why Docker?**
> To move a software from dev server to test server and then into production server with the dependency of the software we will use docker. It's really safe.


## How to dockerize your application?

Suppose you have a process manual for setup your application. And you and your team always follow the manual for setup new/existing applications. **Dockerfile** is that process manual for each application. You'll be needed to write some instruction into the **Dockerfile** according to docker commands. That's it your application will be ready :D. Now let's write a docker file for basic node application.

```
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
**All the capital words are docker built-in commands.**

#### FROM node:lts-alpine as build-stage

Every docker image is created from one or more base images. In that case I am taking node image. In most of the case images are come from [Docker Hub](https://hub.docker.com/). **lts-alpine** means I am taking the node docker image which release tag is LTS(Long Term Support). And **as build-stage** is a alias name.

I was thinking that I am
#### WORKDIR /app

Declaring the work directory inside docker container. Remember a docker container is OS level virtualization, So, here **/app** is same as a unix directory like **/home**.

#### COPY package*.json ./

Coping **package.json** and **package-lock.json** into the working directory. 


#### RUN npm install

**RUN** is a docker command for running shell command inside the docker container. Here we are going to install the dependencies for our application. 


#### COPY . .

Now copy everything into working directory of docker container. If your curious mind asked the question **Why we copied package.json if I am coping now?**. Then my answer will be to the the `npm install` you need a package.json file.


#### RUN npm run build

Build your application. In your case it might be the different command.


#### FROM nginx:stable-alpine as production-stage

Same as before I am pulling the nginx stable release and named it as production-stage.


#### COPY --from=build-stage /app/dist /usr/share/nginx/html

Copy all the distribution files of our application from **/app/dist** to nginx public directory. In your application **/app/dist** might be different. But the process flow should be same.


#### EXPOSE 80

Expose a port. Be careful before you expose any port. You must have access on it. For example, suppose you exposed  5001 port. But this port is not accessible or used by others. Then it's not going to work.


#### CMD ["nginx", "-g", "daemon off;"]

Run nginx from command line from the docker container. 


## Dockerfile to Docker Image

Now we will build the Dockerfile by typing following command.
```
docker build -t iashraful/docker-into .
```
**-t** is for tag. and dot[.] means all.


## Run the image and see effect

```
docker run -it -d -p 5001:80 --rm --name docker-intro iashraful/docker-into
```
Here, **-it** is short for --interactive + --tty when you docker run with this command.. it would take you straight inside of the container,, where **-d** is short for --detach which means you just run the container and then detach from it so basically you run container in the background. **-p** for mapping the machine port with container port. It's machine port:container port. **--rm** means automatically remove the image if it exists, also removes the anonymous volumes associated with the container when the container is removed. **--name** is for naming the container.

If everything is alright till now then open up your browser and hit `http://localhost:5001`. You'll see your application.

I think it's enough for today. I hope next will be **Publishing docker image to Docker Hub** 