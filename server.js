const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const mongoAtlasUri = 'mongodb+srv://kara:mernstack@mern.euolu.mongodb.net/GroceryList?retryWrites=true&w=majority';
//Connect to MongoDB Atlas
mongoose.connect(mongoAtlasUri, {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

// Models
const List = require('./models/List');

app.get('/lists', async (req, res) => {
	const lists = await List.find();

	res.json(lists);
});

app.post('/list/new', (req, res) => {
	const list = new List({
		text: req.body.text
	})

	list.save();

	res.json(list);
});

app.delete('/list/delete/:id', async (req, res) => {
	const result = await List.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/list/complete/:id', async (req, res) => {
	const list = await List.findById(req.params.id);

	list.complete = !list.complete;

	list.save();

	res.json(list);
})

app.put('/list/update/:id', async (req, res) => {
	const list = await List.findById(req.params.id);

	list.text = req.body.text;

	list.save();

	res.json(list);
});

app.listen(3001);