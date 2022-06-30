---
title: FastAPI Streaming Response
date: 2022-06-30T10:39:48.644Z
excerpt: Streaming response is a way to respond user continuously. Today we will learn how to properly use the steaming response.
type: post
blog: true
image: /images/fast-api-cover.png
tags:
  - python
  - fastapi
  - stream

---
## What is a streaming response?
**Streaming Response** basically stream the data. So, how this happen?? Let's say you have a good amount of data. For example, 10MB text data. How you will send data through API? You might get timeout, other network issues for downloading the such a data from server. So, Streaming response come in first place to resolve the issue.

## How it works?
It's really simple. Think how your downloader works, chunk by chunk. So, the Streaming response is. Your 10MB will be downloaded chunk by chunk. In the technical language we call it multipart.

## Streaming Response in FastAPI
```python
from typing import Generator
from starlette.responses import StreamingResponse
from fastapi import status, HTTPException

# A simple method to open the file and get the data
def get_data_from_file(file_path: str) -> Generator:
    with open(file=file_path, mode="rb") as file_like:
        yield file_like.read()

# Now response the API
async def get_image_file(path: str):
    try:
        file_contents = get_image_from_file(file_path=path)
        response = StreamingResponse(
            content=file_contents,
            status_code=status.HTTP_200_OK,
            media_type="text/html",
        )
        return response
    except FileNotFoundError:
        raise HTTPException(detail="File not found.", status_code=status.HTTP_404_NOT_FOUND)
```
You just use the function `get_image_file` and you'll get your desired Streaming response.  

## Why I am writing about it?
Because there is a twist about it. Starlette(The mother of FastAPI) encountered a bug about async generator. To working around the issue in FastAPI it created another issue. When you use sync generator for serving file or stream the response it because really slow.
[Bug link here](https://github.com/encode/starlette/issues/793).

**Moral of the story** We should use the async generator for serving/streaming the API. Implementation is here,
```python
from typing import Generator

# Just use the async function you already have. :)
async def get_data_from_file(file_path: str) -> Generator:
    with open(file=file_path, mode="rb") as file_like:
        yield file_like.read()

```

That's it. Now I am good to go. 