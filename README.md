# Word Chain Solver API

This is an HTTP service that solves word-chain puzzles. Given a start word and a target word, the service finds the shortest sequence of valid words where each word differs from the previous one by exactly one letter. The service is built using **Express.js** and uses **Redis** for dictionary storage and logging.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
4. [Running the Application](#running-the-application)
5. [API Endpoint](#api-endpoint)
6. [Logging](#logging)
7. [Testing](#testing)

## Features

- **Word Chain Solver**: Finds the shortest sequence of valid words between a start word and a target word.
- **Redis Integration**: Uses Redis to store the dictionary and log request details.
- **Dockerized**: Easily run the application and Redis in Docker containers.
- **Logging**: Logs incoming requests and stores detailed logs in Redis.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Docker](https://www.docker.com/)

## Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/word-chain-solver.git
    cd word-chain-solver
    ```
2. **Set Up Environment Variables**:
    Create a `.env` file in the root directory with the following content:

    ```
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

3. **Build and Run with Docker**:
    ```
    docker-compose up --build
    ```
    This will:

    - Start the Redis container.

    - Build and start the Node.js application container.

    - Seed the Redis database with the dictionary.

## Running the Application
Once the containers are running, the API will be available at `http://localhost:3000`.

## API Endpoint
### Solve Word Chain

- **Endpoint**: `POST /word-chains`
- **Description**: Solves the word-chain puzzle for the given start and target words.
- **Request Body**:
  ```json
  {
    "start": "cold",
    "target": "warm"
  }
- **Response**:
  ```json
  {
  "success": true,
  "chain": ["cold", "wold", "word", "ward", "warm"]
  }
  ```

## Logging
The service logs incoming requests to the console and stores detailed logs in Redis. Each log entry includes:

- Timestamp
- User input (start and target words)
- Server response (status, message, and word chain)
- Elapsed time
- Status code

### Viewing Logs in Redis

1. Connect to the Redis container:
    ```bash
    docker exec -it redis redis-cli
    ```
2. Retrieve logs:
    ```bash
    LRANGE logs 0 -1
    ```

### Testing
I have included a Postman collection named `word-chain-solver.postman_collection.json` in this repository that can be used to test different cases. Simply import the collection into Postman and run the requests to verify functionality.
