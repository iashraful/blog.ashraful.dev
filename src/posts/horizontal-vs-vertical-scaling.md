---
title: Horizontal vs Vertical Scaling
date: 2020-09-22T00:00:00.644Z
excerpt: Ideas of scaling and why should we scale up and which one should we use.
type: post
blog: true
image: /images/cloud-server.png
tags:
  - SystemDesign
  - Server
  - CloudComputing
  - LoadBalancing
  - Scaling

---
## :bulb: Idea Behind the Scaling
Suppose I have a business application and I want to access it from anywhere over the internet, so I can make money. So, how I supposed to do that? I know you are brilliant and you have the answer. Yes!! I will rent a machine from a cloud provider and host it traditionally.
After some days my app becomes very popular and so many people are using it. Now the real problem begins. People are facing downtime and I am losing customers :facepalm:. So, I asked one of my friends and he told me to scale up the machine to solve the problem.

## :boom: What is Scalability?
Scalability is able to handle more requests with a bigger machine or adding more machines. There are two types of scaling,  
1. Vertical Scaling  
2. Horizontal Scaling  

**Vertical Scaling**
In one sentence, Buying a bigger machine called vertical scaling. I mean a single machine serves all the requests.

**Horizontal Scaling**
Adding more than one machine is called horizontal scaling. I mean you have already a machine and you add more machines with it to serve the requests. 

## :beers: Pros and Cons

|Horizontal | Vertical|
| --------- | --------- |
| 1. Load balancer required | 1. N/A |
| 2. Call over the network (Little Slower) | 2. Interprocess communication (Faster)|
| 3. No problem until all the servers crash | 3. Single point of failure |
| 4. Data Inconsistency | 4. Consistent |
| 5. Nicely scale up according to need | 5. Hardware limits at some point. |

## :rocket: Conclusion
So, now the big question is **Which one should we use :question:** My answer is **Both**. This actually depends on the system you are designing. Both the scaling system have some good sides. You just need to think about how much big a system you are going to build and how many requests you need to serve in each second and is it consistent to use this model. That it. You'll have your answer. 

