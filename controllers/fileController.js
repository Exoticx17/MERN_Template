const express = require('express');
const { ObjectId } = require('mongodb');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/Ref?retryWrites=true&w=majority'

// Function to upload a file
const filePost = async(req, res) => {
  try {
    const file = req.file;
    const name = req.query.name;
    const description = req.query.description;

    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: { name, description },
    });

    uploadStream.end(file.buffer, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading the file' });
      } else {
        const fileId = uploadStream.id;
        client.close();
        res.json({ id: fileId });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading the file' });
  }
}


// Function to get a specific file in file format
const fileGetOne = async (req, res) => {
  try {
    const name = req.params.name; // Assuming req.params.id contains the desired _id

    // Connect to the MongoDB database
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    // Retrieve the file's content by the provided _id
    const files = await bucket.find({ 'metadata.name': name }).toArray();

    if (!files || files.length === 0) {
      res.status(404).send({ message: 'File not found' });
    } else {
      const file = files[0];
      res.set('Content-Type', file.contentType);
      bucket.openDownloadStream(file._id).pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving file content' });
  }
};

// Function to get all files in json format
const fileGetAllJSON = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const files = await bucket.find().toArray();
    client.close();

    if (files && files.length > 0) {
      res.json({ files });
    } else {
      res.status(404).json({ message: 'No files found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving files' });
  }
};


// Function to a specific file in json format
const fileGetOneJSON = async (req, res) => {
  try {
    const name = req.params.name; // Assuming req.params.id contains the desired _id

    // Connect to the MongoDB database
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    // Retrieve the file's content by the provided _id
    const files = await bucket.find({ name: name }).toArray();

    if (!files || files.length === 0) {
      res.status(404).send({ message: 'File not found' });
    } else {
      const file = files[0];
      res.json({file})
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving file content' });
  }
};


// Function to get files by type (image, video, podcast)
const fileGetType = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const type = req.query.type;
    console.log(type)

    if (!type) {
      return res.status(400).json({ error: 'Type parameter is missing in the request body' });
    }

    let query = {};

    if (type === 'image') {
      query.contentType = { $in: ['image/jpeg', 'image/png'] };
    } else if (type === 'video') {
      query.contentType = 'video/mp4';
    } else if (type === 'podcast') {
      query.contentType = 'audio/mp3';
    } else if (type === 'text') {
      query.contentType = 'text/plain';
    } else {
      return res.status(400).json({ error: 'Invalid file type specified' });
    }

    try {
      const files = await bucket.find(query).toArray();

      if (files && files.length > 0) {
        res.json(files);
      } else {
        res.status(404).json({ error: 'No files found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving files' });
    } finally {
      client.close();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error connecting to the database' });
  }
};



//Function to get and return the metatda of the file
const fileGetMetadata = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const query = { 'metadata.name': req.params.name }; // Query by 'metadata.name' for the file name

    const files = await bucket.find(query).toArray();

    if (!files || files.length === 0) {
      res.status(404).json({ message: 'File not found' });
    } else {
      const file = files[0];
      const metadata = {
        _id: file._id,
        name: file.metadata.name,
        description: file.metadata.description,
      };
      res.json(metadata);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving file metadata' });
  }
};


// Function to search for files by name
const fileGetSearch = async (req, res) => {
  const name = req.query.name;

  try {
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    // Use the $text query to search within the 'metadata.name' field
    const query = { $text: { $search: name } };

    const files = await bucket.find(query).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No files found' });
    }

    return res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving files' });
  }
};


// Function to delete a file
const fileDelete = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);
    const db = client.db('Ref');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const fileId = new mongodb.ObjectId(req.query.id);

    try {
      await bucket.delete(fileId);
      res.send({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting the file' });
    } finally {
      client.close();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to the database' });
  }
};


module.exports = {
  filePost,
  fileGetOne,
  fileGetMetadata,
  fileGetAllJSON,
  fileGetOneJSON,
  fileGetType,
  fileGetSearch,
  fileDelete,
};
