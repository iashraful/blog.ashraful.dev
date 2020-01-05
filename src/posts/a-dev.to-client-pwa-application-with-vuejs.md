---
title: A dev.to client pwa application with vuejs
date: 2019-10-15T02:39:48.644Z
excerpt: This is very basic dev.to API based client pwa application written in vuejs
type: post
blog: true
tags:
  - javascript
  - vuejs
  - vue
  - dev-community
  - pwa
  - api

---

## Intro
Hello there, Have you ever wish to have all the dev.to posts under your own domain. It's time to achieve this. I have created an open source project as dev.to client application. So, that you can easily setup as your own. And it's highly configurable.

## Features
* Single Page Application. So, it's really faster that you believe.
* PWA(Progressive Web App).
* Landing Page with latest five post according to published date.
* List of posts page for showing all posts.
* Clickable Tag and filtering by tag.
* Disqus comments integration.
* Twitter profile and timeline integration.
* Card based cutting-edge design.

## Upcoming Features
* Search for posts
* Dark/Night mode
* Post category/tag showing on sidebar with filtering

## How to run on local machine?
* Fork this repository [Github Repo](https://github.com/iashraful/dev.to-client)
* Clone it from your fork
* Open `user-config.json` file and update according to your blog configuration. i.e:  
* * "dev__to_username" is you dev.to handle/username/login name.
* * "twitter_username" is your twitter username
* * "disqus_shortname" is disqus shorname or discuss comments url prefix.

* `$ npm install`
* `$ npm run serve`  
**Also you can try with the docker.**

## Deploy to VPS/any machine
* I have included the docker file already. So, you can try with docker.

#### Docker Process
> Docker Hub: [Here](https://hub.docker.com/repository/docker/iashraful/dev.to-client)
* `sudo docker build -t iashraful/dev.to-client .`
* `sudo docker run -it -p 5000:80 --rm --name dev.to-client iashraful/dev.to-client`  
**You can customize the port if you need. I that case, you must need to allow the post for tcp/ip connection**

#### Traditional Process
* `$ npm install`
* `$ npm run build`
* Now tell your web server to serve from `dist/` directory.  
**You must remember to forward every request to `/index.html`. 
Because this app handles routing with [Vue Router](https://router.vuejs.org/).** 


## Resources
* [Github Repo](https://github.com/iashraful/dev.to-client)
* [Demo](https://dev-to-client.netlify.com/)

**Happy Blogging :-)**
