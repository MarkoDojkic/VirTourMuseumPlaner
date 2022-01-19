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
app.use(cors({origin: "*"}));

app.post('/register', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var visitorsData = JSON.parse(buffer);
        
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        var newUserData = request.body;
        newUserData.id = uuidv4();
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        if(visitorsData.map(u => u.email).indexOf(newUserData["email"]) !== -1){
            response.sendStatus(403).send("User already exists").end();
            return;
        }
        visitorsData.push(newUserData);
        fs.writeFile("visitors.json", JSON.stringify(visitorsData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200).end();
        });
    });
});

app.post('/login', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var visitorsData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        const loginData = request.body;
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        if (visitorsData.map(user => user.email).indexOf(loginData["email"]) !== -1)
            response.json(visitorsData.find(user => user["email"] === loginData["email"]));
        else response.sendStatus(403);
    });
});

app.get("/getUser/:id", (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var visitorsData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        response.send(visitorsData.find(user => user.id === request.params.id));
    });
});

app.post('/update/:id', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var visitorsData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        var user = visitorsData.find(user => user.id === request.params.id);
        var newUserData = request.body;
        
        visitorsData.splice(visitorsData.indexOf(user), 1, newUserData);
                
        fs.writeFile("visitors.json", JSON.stringify(visitorsData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200).end();
        });
    });
});

app.get('/getExhibitions', (request, response) => {
    function readFromFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
    
    const promises = [
        readFromFile('exhibitions.json'),
        readFromFile('exhibits.json')
    ];
    
    Promise.all(promises).then(result => {
        var exhibitionsData = result[0];
        var exhibitsData = result[1];

        if (!exhibitionsData instanceof Array) exhibitionsData = [exhibitionsData];
        if (!exhibitsData instanceof Array) exhibitsData = [exhibitsData];
        
        exhibitionsData.forEach(exhibition => {
            var exhibits = [];
            exhibition.exhibits.forEach(exhibitId => exhibits.push(exhibitsData.find(e => e.id == exhibitId)))
            exhibition.exhibits = exhibits;
        });

        response.send(exhibitionsData);
    });
});

app.get("/getReviews/:id", (request, response) => {
    function readFromFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
    
    const promises = [
        readFromFile('tours.json'),
        readFromFile('reviews.json'),
        readFromFile('visitors.json')
    ];
    
    Promise.all(promises).then(result => {
        var toursData = result[0];
        var reviewsData = result[1];
        var visitorsData = result[2];
        var output = [];

        if (!toursData instanceof Array) toursData = [toursData];
        if (!reviewsData instanceof Array) reviewsData = [reviewsData];
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        
        toursData.forEach(tour => {
            var review = reviewsData.find(r => r.id == tour.reviews[tour.exhibits.findIndex(e => e == request.params.id)])
            if (review != undefined) {
                review.reviewer = visitorsData.find(user => user.id == review.reviewer);
                output.push(review);
            }
        });
        response.send(output);
    });
});

app.post('/addNewTour/:id', (request, response) => {
    function readFromFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }
    
    const promises = [
        readFromFile('visitors.json'),
        readFromFile('tours.json')
    ];
    
    Promise.all(promises).then(result => {
        var visitorsData = result[0];
        var toursData = result[1];

        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        if (!toursData instanceof Array) toursData = [toursData];
        
        var visitor = visitorsData.find(v => v.id === request.params.id);
        var newTourData = request.body;
        var newId = uuidv4();

        visitor.planer.push({
            "date": newTourData.dateTime,
            "tour": newId
        });

        visitorsData.splice(visitorsData.findIndex(v => v.id === request.params.id), 1, visitor);
        
        fs.writeFile("visitors.json", JSON.stringify(visitorsData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
        });

        toursData.push({
            "id": newId,
            "exhibits": newTourData.exhibits,
            "reviews": [],
            "status": "Текући"
        });

        fs.writeFile("tours.json", JSON.stringify(toursData), (error) => { 
            if (error) response.sendStatus(500).send("Error while writing json data").end();
        });

        response.send("ОК");
    });
});


app.post('/checkIfTourTimeSlotIsAvailable/:id', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var visitorsData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        var visitor = visitorsData.find(visitor => visitor.id === request.params.id);
        
        var targetDateTime = new Date(request.body.dateTime);
        var closestDateTime;

        visitor.planer.map(plan => plan.date).forEach(date => {
            if (closestDateTime === undefined || targetDateTime - date > targetDateTime - closestDateTime)
                closestDateTime = date;
        });

        closestDateTime = new Date(closestDateTime);

        if (Math.abs(Math.floor((targetDateTime - closestDateTime) / (1000 * 60 * 60 * 24))) > 1) return response.sendStatus(200);
        else if (Math.abs(Math.floor((targetDateTime - closestDateTime) / (1000 * 60 * 60))) >= 1) return response.sendStatus(200);
        else return response.send("WRONG_TIME");
    });
});

app.get('/getTourData/:id', (request, response) => {
    function readFromFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    const promises = [
        readFromFile('visitors.json'),
        readFromFile('tours.json'),
        readFromFile('exhibits.json'),
        readFromFile('reviews.json')
    ];

    Promise.all(promises).then(result => {
        var visitorsData = result[0];
        var toursData = result[1];
        var exhibitsData = result[2];
        var reviewsData = result[3];
        var output = [];

        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        if (!toursData instanceof Array) toursData = [toursData];
        if (!exhibitsData instanceof Array) exhibitsData = [exhibitsData];
        if (!reviewsData instanceof Array) reviewsData = [reviewsData];
    
        var visitor = visitorsData.find(v => v.id === request.params.id);
        visitor.planer.forEach(plan => {
            var tour = toursData.find(t => t.id === plan.tour);
            var exhibits = [];
            var reviews = [];
            
            tour.exhibits.forEach(exhibitId => exhibits.push(exhibitsData.find(e => e.id == exhibitId)));
            tour.reviews.forEach(reviewId => reviews.push(reviewsData.find(r => r.id == reviewId)));

            output.push({
                "id": tour.id,
                "exhibits": exhibits,
                "reviews": reviews,
                "status": tour.status,
                "scheduledAt": plan.date
            });
        });

        response.send(output);
    });
});

app.patch('/cancelTour/:id', (request, response) => {
    fs.readFile("tours.json", (error, buffer) => {
        var toursData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!toursData instanceof Array) toursData = [toursData];
        
        var tour = toursData.find(t => t.id === request.params.id);
        tour.status = "Отказан";

        toursData.splice(toursData.findIndex(t => t.id === request.params.id), 1, tour);
        
        fs.writeFile("tours.json", JSON.stringify(toursData), (error) => {
            if (error) response.sendStatus(500).send("Error while writing json data").end();
        });
    });
});

app.patch('/updateTourDateTime/:visitorId/:tourId', (request, response) => {
    fs.readFile("visitors.json", (error, buffer) => {
        var vistorData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!vistorData instanceof Array) vistorData = [vistorData];
        
        var visitor = vistorData.find(v => v.id === request.params.visitorId);
        
        visitor.planer.splice(visitor.planer.findIndex(p => p.tour === request.params.tourId), 1, {
            "date": request.body.date,
            "tour": request.params.tourId
        });

        vistorData.splice(vistorData.findIndex(v => v.id === visitor.id), 1, visitor);
        
        fs.writeFile("visitors.json", JSON.stringify(vistorData), (error) => {
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200);
        });
    });
});

app.patch('/removeExhibitFromTour/:tourId/:exhibitId', (request, response) => {
    fs.readFile("tours.json", (error, buffer) => {
        var toursData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!toursData instanceof Array) toursData = [toursData];
        
        var tour = toursData.find(t => t.id === request.params.tourId);
        
        tour.exhibits.splice(tour.exhibits.findIndex(e => e.id === request.params.exhibitId), 1);

        toursData.splice(toursData.findIndex(t => t.id === request.params.tourId), 1, tour);
        
        fs.writeFile("tours.json", JSON.stringify(toursData), (error) => {
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200);
        });
    });
});

app.delete('/removeTour/:visitorId/:tourId', (request, response) => {
    function readFromFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    const promises = [
        readFromFile('visitors.json'),
        readFromFile('tours.json')
    ];

    Promise.all(promises).then(result => {
        var visitorsData = result[0];
        var toursData = result[1];

        if (!visitorsData instanceof Array) visitorsData = [visitorsData];
        if (!toursData instanceof Array) toursData = [toursData];
    
        var visitor = visitorsData.find(v => v.id === request.params.visitorId);
        visitor.planer.splice(visitor.planer.findIndex(p => p.tour === request.params.tourId), 1);
        visitorsData.splice(visitorsData.findIndex(v => v.id === request.params.visitorId), 1, visitor);
        toursData.splice(toursData.findIndex(t => t.id === request.params.tourId), 1);
        
        fs.writeFile("tours.json", JSON.stringify(toursData), (error) => {
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else {
                fs.writeFile("visitors.json", JSON.stringify(visitorsData), (error) => {
                    if (error) response.sendStatus(500).send("Error while writing json data").end();
                    else response.sendStatus(200);
                });
            }
        });
    });
});

app.patch('/updateReview/:reviewId', (request, response) => {
    fs.readFile("reviews.json", (error, buffer) => {
        var reviewsData = JSON.parse(buffer);
        if (error) {
            console.log(error);
            response.sendStatus(405).send(error).end();
            return;
        }
        if (!reviewsData instanceof Array) reviewsData = [reviewsData];
        
        reviewsData.splice(reviewsData.findIndex(r => r.id === request.params.reviewId), 1, request.body.review);
        
        fs.writeFile("reviews.json", JSON.stringify(reviewsData), (error) => {
            if (error) response.sendStatus(500).send("Error while writing json data").end();
            else response.sendStatus(200);
        });
    });
});