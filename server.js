const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3001;
const app = express();
const path = require("path")

app.use(express.json());
app.use(cors());
app.use(express.static('client/build'));

//This route serves the React app
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));



const mongoAtlasUri = process.env.MONGODB_URI;
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
});