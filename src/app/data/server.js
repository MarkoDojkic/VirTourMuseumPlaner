const express = require("express");
const cors = require('cors');
const app = express();
const port = 21682;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.listen(port, () => {
    console.log(`Node server started at http://localhost:${port}`)
})

app.use(express.json());
app.use(cors({origin: "*"}))

app.post('/register', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var usersData = JSON.parse(buffer);
        
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        var newUserData = request.body;
        newUserData.id = uuidv4();
        if (!usersData instanceof Array) usersData = [usersData];
        if(usersData.map(u => u.email).indexOf(newUserData["email"]) !== -1){
            response.sendStatus(403).send("User already exists").end();
            return;
        }
        usersData.push(newUserData);
        fs.writeFile("visitors.json", JSON.stringify(usersData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200).end();
        });
    });
});

app.post('/login', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var usersData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        const loginData = request.body;
        if (!usersData instanceof Array) usersData = [usersData];
        if (usersData.map(user => user.email).indexOf(loginData["email"]) !== -1)
            response.json(usersData.find(user => user["email"] === loginData["email"]));
        else response.sendStatus(403);
    });
});

app.get("/getUser/:id", (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var usersData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!usersData instanceof Array) usersData = [usersData];
        response.send(usersData.find(user => user.id === request.params.id));
    });
});

app.post('/update/:id', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var usersData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!usersData instanceof Array) usersData = [usersData];
        var user = usersData.find(user => user.id === request.params.id);
        var newUserData = request.body;
        
        usersData.splice(usersData.indexOf(user), 1, newUserData);
                
        fs.writeFile("visitors.json", JSON.stringify(usersData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200).end();
        });
    });
});