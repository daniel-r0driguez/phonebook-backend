const express = require('express');
const app = express();

let entries = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

app.use(express.json());

const generateID = () => {
    const num = Math.floor((Math.random() * 10000) % 11111);
    return num;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body) {
        return response.status(400).json({
            error: "content missing"
        });
    }

    const entry = {
        id: generateID(),
        name: body.name,
        number: body.number
    }

    entries = entries.concat(entry);
    response.json(entry);
})

app.get('/api/persons', (request, response) => {
    response.json(entries);
})

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${entries.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const entry = entries.find(_entry => _entry.id === id);

    if (entry) {
        response.json(entry);
    }
    else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    entries = entries.filter(entry => entry.id !== id);
    console.log(entries);
    response.status(204).end();
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})