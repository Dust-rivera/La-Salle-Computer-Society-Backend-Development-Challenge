const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

const mockProducts = [
    {id: 1, name: "Logitech G502 HERO", price: 79.99},
    {id: 2, name: "Razer DeathAdder V2", price: 69.99},
    {id: 3, name: "Corsair Dark Core RGB Pro SE", price: 89.99},
    {id: 4, name: "SteelSeries Rival 600", price: 79.99},
    {id: 5, name: "Glorious Model O", price: 49.99},
    {id: 6, name: "Finalmouse Starlight-12", price: 199.99},
    {id: 7, name: "Cooler Master MM710", price: 39.99},
    {id: 8, name: "ASUS ROG Gladius III", price: 99.99},
    {id: 9, name: "HyperX Pulsefire Haste", price: 59.99},
    {id: 10, name: "Logitech G Pro X Superlight", price: 149.99},
];

app.get('/', (req, res) => {
    res.send("hello ");
})

//ROUTE PARAMETERS
app.get('/api/products/:id', (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);

    if(isNaN(parsedId)) {
        return res.status(400).json({ error: 'noob' });
    }
    const product = mockProducts.find(p => p.id === parsedId);
    if(!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
})

//POST REQUESTS
app.post('/api/products', (req, res) => {
    const { body } = req;
    const newProduct = { id: mockProducts[mockProducts.length - 1].id + 1, ...body};
    mockProducts.push(newProduct);
    return res.status(201).send(newProduct);
})

//GET REQUESTS
app.get('/api/products', (req, res) => {
    console.log(req.query);
    const {
        query: {filter, value},
    } = req;
    if(!filter && !value) return res.send(mockProducts);

   //QUERY REQUESTS
    if(filter && value) return res.send(
        mockProducts.filter(name => name[filter].includes(value))
    )

    return res.send(mockProducts)
})

//PUT REQUESTS
app.put('/api/products/:id', (req, res) => {
    const {
        body, 
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return res.status(400).json({ error: 'noob' });
    }

    const findProductIndex = mockProducts.findIndex(
        (products) => products.id === parsedId
    )
    if(findProductIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    mockProducts[findProductIndex] = {id: parsedId, ...body}; 

    return res.sendStatus(200);
})

//PATCH REQUESTS
app.patch('/api/products/:id', (req, res) => {
    const {
        body,
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return res.status(400).json({ error: 'noob' });
    }
    const findProductIndex = mockProducts.findIndex(
        (products) => products.id === parsedId
    )
    if(findProductIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    mockProducts[findProductIndex] = {
        ...mockProducts[findProductIndex],
        ...body,
    };
    return res.sendStatus(200);
})

//DELETE REQUESTS
app.delete('/api/products/:id', (req, res) => {
    const {
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
        return res.status(400).json({ error: 'noob' });
    }
    const findProductIndex = mockProducts.findIndex(
        (products) => products.id === parsedId
    )
    if(findProductIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }   
    mockProducts.splice(findProductIndex,1);
    return res.sendStatus(200);
})

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})