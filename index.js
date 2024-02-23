const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/products.models.js');
const { json } = require('express');
const { response } = require('express');
const { request } = require('http');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public')); // Add this line
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World  okay ');
});



app.post('/api/products', upload.single('image'), async (req, res) => {
    try{
        const product = await Product.create({
            ...req.body,
            image: req.file.path // req.file contains information about the uploaded file
        });
        res.status(201).json({product});
    }       
    catch(err){
        res.status(500).json({error: err}); 
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const products = await Product.find({ name: new RegExp(searchQuery, 'i') });
        res.status(200).json({products});
    } catch(err) {
        res.status(500).json({error: err}); 
    }
});

app.get('/api/products/:id/uploads', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.image) {
            throw new Error('No image found');
        }

        res.set('Content-Type', 'image/jpeg'); // Or whatever the correct MIME type is
        res.send(product.image);
    } catch (err) {
        res.status(404).json({ error: err.toString() });
    }
});

// Update a product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            ...req.body,
            image: req.file ? req.file.path : undefined // Update the image only if a new file is uploaded
        }, { new: true }); // Returns the updated document
        res.status(200).json({product});
    } catch(err) {
        res.status(500).json({error: err});  
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({product});
    } catch(err) {
        res.status(500).json({error: err});
    }
});

mongoose.connect("mongodb+srv://shivamatjp:FMG59aAfy0Poo8hf@crudapi.iuwyqrx.mongodb.net/Node-api?retryWrites=true&w=majority")
.then(() => {
    console.log('Database connected');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch((err) => {
    console.log(" connection failed");
    console.log(err);   
});