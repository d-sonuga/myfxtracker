# MyFxTracker Project Overview

This is all the code for the whole project.
It's divided into 2 sections, frontend and backend in src
The docs folder doesn't have actual technical docs, but rather
a closer overview

## Development
To launch the development environment, launch 2 docker containers for the frontend
and backend respectively
The Dockerfiles in the backend and frontend directories are used for the development builds

## Testing
To run the backend automated tests, launch the backend development container. The rqworkers must be off for 
synchronization and determinisitic results.

### Update
Functional testing is nearly non existent right now

## Deployment
For deployment, only a python container is used.
The Dockerfile in the src directory is used for deployment

### Deployment Check
*   build the frontend
*   build the frontend's calculator
*   freeze the backend's dependency requirements into a file, if the requirements have changed