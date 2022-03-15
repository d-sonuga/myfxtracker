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
To run the functional tests, you need to run 3 containers: 1 for the frontend, backend and
the selenium server each and connect them to the same network where they have frontend, backend
and firefox as their hostnames respectively. In the backend container, you have to run
maildump and set the environment variable TEST to true

## Deployment
For deployment, only a python container is used.
The Dockerfile in the src directory is used for deployment

### Deployment Check
*   build the frontend
*   build the frontend's calculator
*   freeze the backend's dependency requirements into a file, if the requirements have changed