# MyFxTracker Project Overview

This is all the code for the whole project.
It's divided into 2 sections, frontend and backend in src
The docs folder doesn't have actual technical docs, but rather
a closer overview

## Development
To launch the development environment, launch docker-compose up in the src to start a container for the frontend, backend and for a firefox selenium container for testing
The Dockerfiles in the backend and frontend directories are used for the development
builds

## Deployment
For deployment, only a python container is used.
The Dockerfile in the src directory is used for deployment

### Deployment Check
*   build the frontend
*   build the frontend's calculator