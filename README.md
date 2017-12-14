# Code Fellows 401 Lab 13
The purpose of this lab is to build a basic HTTP server using the Express library that takes GET, POST, and DELETE requests that read, add, and delete an object from an array.  The object is a Wizard with 5 properties: name, type, city, the date entered, and id (which is assigned by the API).  Name is unique and cannot match another entry.  The data is stored on a MongoDB database.  Mongoose is used to interface between the server and Mongo.

## Code Style
Standard Javascript with ES6.

## Features
Users can get a list of all wizards by sending a GET request with no body.  To get a particular wizard, send a GET request with a body of ```{id: '<id of wizard you want>'}```
To put a new wizard in the array, send a POST request with the body ```{name: '<name>', type: '<type>', city: '<city>'}```
To delete a wizard from the array, send a DELETE request with the body ```{id: '<id of wizard to delete>'}```.

## Running the Server
To run the server, download the repo.  Install dependencies via ```npm install```.  Create a folder called '.env' in the root directory of this project and enter ```PORT=<yourport>``` on the first line.  3000 is a typical choice.  Also in the .env, set MONGODB_URI=mongodb:<database location>.  '://localhost/testing' is normal.  
.env example:

    PORT=3000
    MONGODB_URI=mongodb://localhost/testing


Then, ```npm start```.

## Endpoints

### GET ('/api/wizards')
Sent without a query.  
* Returns status 200 and an array of all the objects on the database.

### GET ('api/wizards:id')
Sent with the query of an object with the key "id".  
* If the id is found on the database, returns status 200 and the object that matches that id.  
* If the id is not found on the database, returns status 404 and an error message.

### POST ('api/wizards')
Sent with the query of an object with the keys name, city, and state.
* name and city are required.  State is optional.
* If all keys are there, returns status 200 and the body of the object it just created with your data.  Will also include a unique id created by uuid.
* If any key is missing or misspelled or no body is sent, returns status 400 and an error message.
* If an object is sent that contains a name that matches an existing name, returns status 404 and an error message.

### DELETE ('api/wizards/:id')
Sent with the query of an object with the key "id".
* If sent correctly, returns with status 204.
* If id is not found, returns 404 and an error message.
* If no body is sent, returns with status 400 and an error message.

### PUT ('api/wizards/:id')
Sent with the query of an object with the key "id" and a body with an object of the keys and values you want to update.
* If id is found, returns status 200.
* If id is not found, returns 404 and an error message.
* If no body is sent, returns with status 400 and an error message.
* If a name is attempted to be updated to match an existing entry, returns status 404 and an error message.

## Libraries
body-parser, dotenv, express, http-errors, mongoose, winston

## Development Libraries
eslint, faker, jest, superagent

## Author
Dalton Carr