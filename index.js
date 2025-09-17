const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

var data = [
    {name: 'John', age: 20},
    {name: 'Peter', age: 21},
    {name: 'Sally', age: 19}
];

app.get('/', (req, res) => {
    res.send(data);
})

app.listen(3000,() => {
    console.log('Server is runnnig on port 3000');
})