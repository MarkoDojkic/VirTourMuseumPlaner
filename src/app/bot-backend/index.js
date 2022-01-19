const express = require('express');
const cors = require('cors');
const dff = require('dialogflow-fulfillment');
const axios = require('axios');
const app = express();
const port = 21683;

app.listen(port, () => {
    console.log(`Node server started at http://localhost:${port}`)
});

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/', (request, response) => response.send(`Node server started at http://localhost:${port}`));

app.post('/', (request, response) => {
    const agent = new dff.WebhookClient({ request: request, response: response });
	
	var intentMap = new Map();
    intentMap.set('Exhibitions category ask', categorySearchExhibition);
    intentMap.set('Exhibitions category response', categoryDetailExhibition);
    intentMap.set('Exhibitions category show all', showAllExhibitionsFromCategory);
    intentMap.set('Exhibits category ask', categorySearchExhibit);
    intentMap.set('Exhibits category response', categoryDetailExhibit);
    intentMap.set('Exhibits category show all', showAllExhibitsFromCategory);
    intentMap.set('Exhibits find by title', findExhibitByTitle);
    intentMap.set('Exhibits find by description', findExhibitByDescription);
    agent.handleRequest(intentMap);
});

async function categorySearchExhibition(agent) {

    let payload = {
        "richContent": [
            []
        ]
    };

    var options = [];

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        const allCategories = new Set(response.data.map(e => e.type));
        
        for (category of allCategories) {
            payload.richContent[0].push(
                {
                    "type": "button",
                    "icon": {
                        "type": "museum",
                        "color": "#FF9800"
                    },
                    "text": `${category}`,
                    "event": {
                        "languageCode": "en",
                        "name": "UserHasSelectedExhibitionCategory",
                        "parameters": {
                            "selectedCategory": `${category}`
                        }
                    }
                }
            );
        }
        
        agent.add("У понуди имамо следеће категорије поставки. Изаберите ону коју желите.");
        agent.add(new dff.Payload(
            agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
        ));
        
    });    
}

async function categoryDetailExhibition(agent) {
    const selectedCategory = agent.parameters.selectedCategory;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        const allExhibitions = response.data.filter(e => e.type == selectedCategory);
        
        if (allExhibitions.length === 0) {
            agent.add("Изабрали сте категорију " + selectedCategory + ", али за њу тренутно непостоји ни једна поставка.")
        } else {
            agent.add("Изабрали сте категорију " + selectedCategory + ". Укупно број поставки које припадају тој категорији је: " + allExhibitions.length);
            agent.add("Да ли желите да видите информације о тим поставкама?");
            agent.add(new dff.Payload(
                agent.UNSPECIFIED, {
                    "richContent": [
                        [
                            {
                                "type": "button",
                                "icon": {
                                  "type": "done_outline",
                                  "color": "#42FF00"
                                },
                                "text": "Да",
                                "event": {
                                    "name": "UserWantsToSeeAllExhibitonDetailsFromCategory",
                                    "languageCode": "en",
                                    "parameters": {
                                        "selectedCategory": `${selectedCategory}`
                                    }
                                }
                            },
                            {
                                "type": "button",
                                "icon": {
                                    "type": "cancel",
                                    "color": "#FF0000"
                                },
                                "text": "Не",
                                "event": {
                                    "name": "Goodbye",
                                    "languageCode": "en"
                                }
                            }
                        ]
                    ]
                }, { sendAsMessage: true, rawPayload: true }
            ))
        }
    });
}

async function showAllExhibitionsFromCategory(agent) {

    var exhibitions;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        exhibitions = response.data.filter(e => e.type == agent.parameters.selectedCategory);
    });
        
    var outputText = ``;

    for (exhibition of exhibitions) {

        var totalCost = 0;
        var totalTime = 0;
        var totalAverageRating = 0;

        for (exhibit of exhibition.exhibits) {
            totalCost += exhibit.price;
            totalTime += exhibit.time;

            await axios.get("http://localhost:21682/getReviews/" + exhibit.id).then(response => {       
                if (response.data.length !== 0) totalAverageRating += response.data.map(r => parseInt(r.rating)).reduce((total, rating) => total += rating, 0) / parseInt(response.data.length);
            });   
            
        }
        outputText += `                                          
        ----------------------------------------------------------
            Врста поставке: '${exhibition.type}'\n
            Врста експоната: '${exhibition.exhibitsType}'\n
            Број експоната: ${exhibition.exhibits.length}\n
            Укупна цена обиласка: ${totalCost} динара\n
            Укупно време обиласка: ${totalTime} минута\n
            Просечна оцена: ${parseFloat(totalAverageRating / parseInt(exhibition.exhibits.length)).toFixed(2)}
        ----------------------------------------------------------\n
        `;
    }
    
    agent.add("Супер, у наставку се налазе тражене информације");
    agent.add(outputText);
}

async function categorySearchExhibit(agent) {

    let payload = {
        "richContent": [
            []
        ]
    };

    var options = [];

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        const allCategories = new Set(response.data.map(e => e.exhibitsType));
        
        for (category of allCategories) {
            payload.richContent[0].push(
                {
                    "type": "button",
                    "icon": {
                        "type": "category",
                        "color": "#FF9800"
                    },
                    "text": `${category}`,
                    "event": {
                        "languageCode": "en",
                        "name": "UserHasSelectedExhibitCategory",
                        "parameters": {
                            "selectedCategory": `${category}`
                        }
                    }
                }
            );
        }
        
        agent.add("У понуди имамо следеће категорије експоната. Изаберите ону коју желите.");
        agent.add(new dff.Payload(
            agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
        ));
        
    });    
}

async function categoryDetailExhibit(agent) {
    const selectedCategory = agent.parameters.selectedCategory;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        const allExhibits = [].concat.apply([],response.data.filter(e => e.exhibitsType == selectedCategory).map(e => e.exhibits));
        
        if (allExhibits.length === 0) {
            agent.add("Изабрали сте категорију " + selectedCategory + ", али за њу тренутно непостоји ни један експонат.")
        } else {
            agent.add("Изабрали сте категорију " + selectedCategory + ". Укупно број експоната које припадају тој категорији је: " + allExhibits.length);
            agent.add("Да ли желите да видите информације о тим експонатима?");
            agent.add(new dff.Payload(
                agent.UNSPECIFIED, {
                    "richContent": [
                        [
                            {
                                "type": "button",
                                "icon": {
                                  "type": "done_outline",
                                  "color": "#42FF00"
                                },
                                "text": "Да",
                                "event": {
                                    "name": "UserWantsToSeeAllExhibitDetailsFromCategory",
                                    "languageCode": "en",
                                    "parameters": {
                                        "selectedCategory": `${selectedCategory}`
                                    }
                                }
                            },
                            {
                                "type": "button",
                                "icon": {
                                    "type": "cancel",
                                    "color": "#FF0000"
                                },
                                "text": "Не"
                            }
                        ]
                    ]
                }, { sendAsMessage: true, rawPayload: true }
            ))
        }
    });
}

async function showAllExhibitsFromCategory(agent) {

    var exhibits;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        exhibits = [].concat.apply([], response.data.filter(e => e.exhibitsType == agent.parameters.selectedCategory).map(e => e.exhibits));
    });
    
    var outputText = ``;

    for (exhibit of exhibits) {
        
        var averageRating = 0.0;

        await axios.get("http://localhost:21682/getReviews/" + exhibit.id).then(response => {       
            if (response.data.length !== 0) averageRating = response.data.map(r => parseInt(r.rating)).reduce((total, rating) => total += rating, 0) / parseInt(response.data.length);
        }); 

        outputText += `                                          
        ----------------------------------------------------------
            Врста експоната: '${agent.parameters.selectedCategory}'\n
            Назив: ${exhibit.title}\n
            Опис: ${exhibit.description}\n
            Цена обиласка: ${exhibit.price} динара\n
            Време обиласка: ${exhibit.time} минута\n
            Просечна оцена: ${averageRating.toFixed(2)}
        ----------------------------------------------------------\n
        `;
    }
    
    agent.add("Супер, у наставку се налазе тражене информације");
    agent.add(outputText);
}

async function findExhibitByTitle(agent) {
    
    var exhibits;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        exhibits = [].concat.apply([],response.data.map(e => e.exhibits)).filter(ex => ex.title.toLowerCase().includes(agent.parameters.keyword.toLowerCase()));
    });
    
    var outputText = ``;

    for (exhibit of exhibits) {

        var averageRating = 0.0;

        await axios.get("http://localhost:21682/getReviews/" + exhibit.id).then(response => {       
            if (response.data.length !== 0) averageRating = response.data.map(r => parseInt(r.rating)).reduce((total, rating) => total += rating, 0) / parseInt(response.data.length);
        }); 

        outputText += `                                          
        ----------------------------------------------------------
            Назив: ${exhibit.title}\n
            Опис: ${exhibit.description}\n
            Цена обиласка: ${exhibit.price} динара\n
            Време обиласка: ${exhibit.time} минута\n
            Просечна оцена: ${averageRating.toFixed(2)}
        ----------------------------------------------------------\n
        `;
    }
    
    if (outputText.length === 0) agent.add("Нажалост ниједан експонат није пронађен који садржи тражену кључну реч у свом називу");
    else {
        agent.add("Ево које сам експонате нашао који садрже тражену кључну реч у називу");
        agent.add(outputText);
    }
}

async function findExhibitByDescription(agent) {

    var exhibits;

    await axios.get("http://localhost:21682/getExhibitions").then(response => {
        exhibits = [].concat.apply([],response.data.map(e => e.exhibits)).filter(ex => ex.description.toLowerCase().includes(agent.parameters.keyword.toLowerCase()));
    });
    
    var outputText = ``;

    for (exhibit of exhibits) {

        var averageRating = 0.0;

        await axios.get("http://localhost:21682/getReviews/" + exhibit.id).then(response => {       
            if (response.data.length !== 0) averageRating = response.data.map(r => parseInt(r.rating)).reduce((total, rating) => total += rating, 0) / parseInt(response.data.length);
        }); 

        outputText += `                                          
        ----------------------------------------------------------
            Назив: ${exhibit.title}\n
            Опис: ${exhibit.description}\n
            Цена обиласка: ${exhibit.price} динара\n
            Време обиласка: ${exhibit.time} минута\n
            Просечна оцена: ${averageRating.toFixed(2)}
        ----------------------------------------------------------\n
        `;
    }
    
    if (outputText.length === 0) agent.add("Нажалост ниједан експонат није пронађен који садржи тражену кључну реч у свом опису");
    else {
        agent.add("Ево које сам експонате нашао са траженим описом");
        agent.add(outputText);
    }
}