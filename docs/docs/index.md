# High Level Overview
There are 3 main components

*   Frontend
*   Backend
*   Trader data source

## Frontend
-   For now consists of only a web app, but may be expanded
-   New ways of displaying data may be added at any time
-   New statistics to be calculated may be added at any time

Roles
-----
*   Receiving trader data from backend
*   Storing peripheral trader data on backend
*   Displaying statistics in various formats based on the data received from the backend
*   Point of communication between traders and myfxtracker
*   Signing up, logging in, deleting accounts
*   Calculating statistics based on user data

## Backend
-   A django server

Roles
-----
*   Receiving data from the trader data source
*   Saving trader data
*   Keeping track of user info, sign ups, log ins, and other peripheral data


## Trader Data Source
-   Metatrader EA
-   New trader data sources may be added at any time
Roles
-----
*   Send trader data to the backend whenever new data becomes available
