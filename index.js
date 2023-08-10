const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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
app.use(cors());
app.use(express.static('build'));
app.use(morgan((tokens, req, res) => {
    console.log(req.body);
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ');
    }));

const generateID = () => {
    const num = Math.floor((Math.random() * 10000) % 11111);
    return num;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const badRequest = (errorMsg) => {
        response.status(400).json({
            error: errorMsg
        })
    }

    if (!body) {
        return badRequest('content missing')
    }
    else if (!body.name)
    {
        return badRequest('name missing');
    }
    else if(!body.number)
    {
        return badRequest('number missing');
    }
    else if (entries.find(entry => entry.name === body.name))
    {
        return badRequest('names must be unique');
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})