---
title: Database & Introduction to SQLAlchemy
date: 2021-09-04T00:00:00.644Z
excerpt: A beginner friendly project based Fast-API introduction
type: post
blog: false
fastApiSeries: true
order: 2
image: /images/fast-api-cover.png
tags:
  - FastAPI
  - Python
  - REST-API
  - Beginner
  - WebDev
---

## Introduction
Fast-API is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints. In this tutorial we will be covering the following things,
* Project Setup
* Introducing with SQLAlchemy, Pydantic etc necessary modules
* Model vs Schema, Data validation
* Making APIs, Query Params
* Database migration with Alembic (SQLAlchemy tool)
* Authentication with JWT

## Project Structure
Many men many minds. So this project structure is a Bible that you can't override. I just personally like this kind of structure.

```
|-- api
|  |-- core
|    |-- __init__.py
|    |-- database.py
|    |-- model_base.py
|  |-- models
|    |-- # Here we will add our models(tables for database) and will be imported to __init__.py
|    |-- __init__.py
|  |-- schemas
|    |-- __init__.py
|  |-- routers
|    |-- __init__.py
|  |-- main.py
|-- requirements.txt
|-- .gitignore
```
**We will be adjusting the structure in near future according to project's need**


