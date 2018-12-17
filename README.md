# Fortinet Take Home

Loads signatures from a specific url and displays them in a readable manner.
Loads a table, with each row clickable for more detail about a signature.
Can Sort by ID, Name, and Date.
Can Search by ID and Name

Requires CORS Plugin [Chrome Store](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) on chrome, since I dont have access to the server, I was unable to bypass this CORS problem reasonably with a server sided proxy, or CORS headers sent by the server. Thought about jsonp but endpoint didnt return a valid json and I didnt want to use extra jquery plugins. I think this chrome plugin was a good solution for this small project.
Will be unable to get data from endpoint if plugin isn't installed.
One idea is to have the server make the request for data and send the index with elements rendered already.

Demo currently hosted on Amazon [Here](http://fortinetwebapp.us-west-2.elasticbeanstalk.com/)

### Installing

Make sure you have nodejs and npm installed

Clone the repository

Install depedencies

```
npm install
```

## Deployment

run "npm start" to run locally on port 8080

navigate to "localhost:8080"

## Usage

Can search or sort table of signatures.
Click on a row to display more details about that signature below the table.

## Improvements

- Better interaction with sort and search, sorting resets the search filter as it re-renders the whole table. That means you must search before sorting to get desired results.
	Fix: Can keep a array(state) of currently displayed elements and sort those accordingly
- Have icons in table headers to show current sort status
- Server currently only serving static files. Can have end points to do sort and searches on data that will then be stored in a database. Therefore	less work on the client side and more server side processing, is probably faster once our data set grows extremely large.

## Authors

* **Harris Lin**