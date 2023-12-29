# MyFxTracker Project Overview

This is a project I worked on with a forex trader between 2021 and 2022.
It's a web app that helps forex traders analyze their trading performance.
We didn't make a dime from it, so we eventually stopped running the site.
An archived version of it is at https://myfxtracker.fly.dev.

This is all the code for the whole project and it contains the entire history.
It's divided into 2 sections, frontend and backend in `src`.

# Technical Debt

I did not follow all the best practices. My mentality during this project's creation was to *get shit done*.

The docs folder doesn't have actual technical docs, but rather
a closer overview, which got outdated.

Due to the several get-shit-done iterations that this app went through, there's a fair amount 
of technical debt:
* The docs in the docs folder are outdated, so if you're looking through the code, don't bother with it.
* There are docker files and shell scripts here and there, some of which were used for a while before being abandoned.
* There's some dead code here and there.
* The `functional_tests` folder barely contains anything (who has time to do fragile end-to-end tests when
you just want to get shit done?), and so on.
* There are also some outdated READMEs and docs in some places.

There's a `heroku.yml` file that was used when Heroku still had its free tier.

There are also some bugs here and there.

The `fly.toml` file is what I used to deploy the archive on Fly.io.

# Development
To run this on your computer, you can try to use the `docker-compose.yml` or start
containers with the various `Dockerfile`s in the `src/backend` and `src/frontend`
directory, but it's been a really long while since I've taken a look at this
project, so you're probably going to have some problems with that.

The alternative is to run the React dev server for the frontend and Django's
dev server for the backend.

To start the frontend dev server:

* cd into `src/frontend`
* Run `npm install`
* cd into `src/frontend/calculator`
* Run `npm install` and `npm link`
* cd back: `..`
* Run `npm link calculator`
* Finally, run `npm start`. After this step, the React app should be available from localhost:3000

To start the backend dev server:

* cd into `src/backend`
* Run `pipenv install` (you need to install pipenv before this)
    * Note: you're probably going to have some problems with package versions & dependency conflicts. I'm sure you can deal with them
* Run `pipenv shell`
* You have to set a bunch of environment variables. See `src/backend/core/settings.py` for details
* Ensure your Postgres server is running and sufficient permissions are in place for your configured user
to access it
* Run `python manage.py runserver`. After this step, the backend server should be available from localhost:8000

# Testing
To run the backend automated tests, make sure your Postgres server is running, cd into `src/backend`, run 
`pipenv shell`, then `python manage.py test`.

There are virtually no frontend tests.

I never really got around to fleshing out those functional/end-to-end tests.

# Deployment

First, the frontend app has to be built: cd into `src/frontend` and run `npm run build`.
The Dockerfile in the root directory is then used to launch a Python container which then runs `run.sh`.
`run.sh` collects the transpiled frontend app into a `staticfiles` directory in `backend`.
It's the Daphne server that then serves those files in production.

# Structure

## Frontend

`src/frontend/calculator` holds code that does various calculations on trade data.
In `src/frontend`:

* `apps/info-app`: the landing page with information on the project
* `apps/trader-app`: the trader's dashboard
* `apps/aff-app`: the dashboard for the half-baked affiliate idea that didn't have the chance to get anywhere
* `components`: reusable React components, mostly based on the MUI library
* `conf`: routes, backend URLs, generic styles, colors and utility functions to deal with them
* `services`: the `http` module and some generic messages
* `visuals`: some images and SVGs

## Backend

* `admin`: ... I'm not exactly sure what this was for. I can't seem to remember
* `affiliate`: for the half-baked affiliate idea
* `core`: settings and stuff
* `datasource_endpoint`: used to receive trade data from traders' MetaTrader terminals through expert advisors
* `db`: attempt at documenting the database structure at some point in time (outdated)
* `flutterwave_endpoint`: for handling Flutterwave webhooks
* `functional_tests`: a few functional tests I never really got to finish
* `paypal_endpoint`: I think, for handling Paypal webhooks and other Paypal stuff
* `paystack_endpoint`: for handling Paystack webhooks and other Paystack stuff
* `serve`: for serving the bundled React app
* `trader`: provides APIs for the trader's frontend
* `users`: everything else related to users

# A Note On The Project's Evolution
Initially, when this project started, the traders were to manually input their trade data.
As you might have imagined, this was stressful, so we switched to using expert advisors to retrieve this
data.

As it turns out, the expert advisor path was still very stressful for the users, so we switched to a
dollar-drinking API that sucked some serious green from the account. This was MetaApi.

We also switched payment methods a few times from Paypal to Paystack to Flutterwave.

These changes are very much evident in the backend's codebase as there are a lot of apps (Django's terminology
for folders) dedicated to things that aren't being used in the code.

Another thing: because of the thirstiness of the API finally settled on, we had to make some decisions on how to
handle the retrieval of the user's data. We eventually settled on periodically retrieving users' data and
using the database as a cache, giving the user the option of refreshing their data on the app frontend.

This API decision also led me to organize the core functions of the app's backend around queues.
For example, usually, when a user presses a button to delete the user's account, a request is sent to the
backend to trigger the deletion. The function that handles the deletion then returns after the deletion of all
the user's data has completed. But because of the possibility of the API failing or taking a long time to
answer (and therefore blocking a thread), I decided to make these functions that carry out tasks place the task on 
a queue, save the task state in the database, and return immediately. The frontend app then polls continuously
after every interval, say 5 seconds, for the state of the task. If it's still ongoing, a "pending" response
is returned; if it resolved with an error, an error response is returned, and if it resolved successfully,
a success response is returned. These decisions greatly complicated the code.
