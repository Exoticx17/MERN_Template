const express = require('express');
const { ObjectId } = require('mongodb');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/Ref?retryWrites=true&w=majority';

// Function to create a new idea in the database
const ideaPost = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('Ref');
    const newIdea = await db.collection('ideas').insertOne({
      name: req.body.name,
      description: req.body.description,
      itags: req.body.itags,
      user: req.query.userId
    });
    client.close();
    res.status(201).json(newIdea);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to retrieve all ideas from the database
const getIdeas = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('Ref');
    const ideas = await db.collection('ideas').find().toArray();
    client.close();
    res.status(200).json(ideas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to retrieve a single idea by its ID
const getIdeaOne = async (req, res) => {
    try {
      const client = await mongoClient.connect(url);
      const db = client.db('Ref');
      const idea = await db.collection('ideas').findOne({
        _id: new ObjectId(req.query.id), // Create an instance of ObjectId
      });
      client.close();
      if (!idea) {
        return res.status(404).json({ message: 'Idea not found' });
      }
      res.status(200).json(idea);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Function to retrieve itags (tags) of a single idea by its ID
const getIdeaItags = async (req, res) => {
    try {
      const client = await mongoClient.connect(url);
      const db = client.db('Ref');
      const idea = await db.collection('ideas').findOne({
        _id: new ObjectId(req.query.id), // Create an instance of ObjectId
      });
      client.close();
      if (!idea) {
        return res.status(404).json({ message: 'Idea not found' });
      }
      const itags = idea.itags; // Assuming itags is an array in your MongoDB document
      res.status(200).json(itags);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


// Function to retreive data by searching through the title
  const searchIdeasByTitle = async (req, res) => {
    try {
      const client = await mongoClient.connect(url);
      const db = client.db('Ref');
      const searchTitle = req.query.title; // Assuming the title is provided as a query parameter
      const ideas = await db.collection('ideas').find({ $text: { $search: searchTitle } }).toArray();
  
      client.close();
      res.status(200).json(ideas);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Function to edit an existing idea
const ideaEdit = async (req, res) => {
    try {
      const client = await mongoClient.connect(url);
      const db = client.db('Ref');
      const filter = { _id: new ObjectId(req.query.id) }; // Create an instance of ObjectId
      const update = {
        $set: {
          name: req.body.name,
          description: req.body.description,
          itags: req.body.itags,
        },
      };
      const result = await db.collection('ideas').updateOne(filter, update);
      client.close();
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  // Function to delete an existing idea
  const ideaDelete = async (req, res) => {
    try {
      const client = await mongoClient.connect(url);
      const db = client.db('Ref');
      const filter = { _id: new ObjectId(req.query.id) }; // Create an instance of ObjectId
      const result = await db.collection('ideas').deleteOne(filter);
      client.close();
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  ideaPost,
  getIdeas,
  getIdeaOne,
  getIdeaItags,
  searchIdeasByTitle,
  ideaEdit,
  ideaDelete,
};
