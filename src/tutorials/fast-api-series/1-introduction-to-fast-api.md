---
title: Introduction to Fast-API
date: 2021-09-02T00:00:00.644Z
excerpt: A beginner friendly project based Fast-API introduction
type: post
blog: false
fastApiSeries: true
order: 1
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

- Project Setup & Our First API (Hello World!)
- API Path, Query and Type hints
- Pydantic Model and Data validation
- Introducing Async/Await (asyncio)
- Error Handling
- Setting up Database with SQLAlchemy
- Database migration with Alembic (SQLAlchemy tool)
- API Versioning
- Authentication with JWT
- Dependency Injection
- Dockerize the app

## Project Structure

Many men many minds. So this project structure is not a Bible that you can't override. I just personally like this kind of structure.

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
