const express = require('express');
const PORT = 4000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config')

global.__basedir = __dirname;

//Connection to MongoDB Database
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

//required models
require('./models/user_model');
require('./models/post_model');

app.use(cors());
app.use(express.json());

//required routers
app.use(require('./routes/user_route'));
app.use(require('./routes/post_route'));
app.use(require('./routes/file_route'));


// Listning to PORT 4000 
app.listen(PORT, () => {
    console.log("Server started");
});