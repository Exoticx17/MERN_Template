const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const fileRoutes = require('./routes/fileRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();

// Middleware
const corsOpts = {
    origin: 'http://localhost:3000', // Replace with the port your frontend is running on
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
  };
  
  // Combine the cors and bodyParser middleware
  app.use(cors(corsOpts));
  app.use(bodyParser.json());
  

// Use express.json() instead of bodyParser.json()
app.use(bodyParser.json());

app.use(methodOverride('_method'));
app.use(cookieParser());

// Routes
app.use('/user', userRoutes);
app.use('/idea', ideaRoutes)
app.use('/file', fileRoutes)
app.use('/vote', voteRoutes)

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
