const express = require('express');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const User = require('../models/userModel');
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/Ref?retryWrites=true&w=majority'

// Function to create a new vote sheet with the updated data structure
const voteSheetPost = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Name is required' });
    }

    const industries = [
      'computer',
      'finance',
      'manufacturing',
      'agriculture',
      'medical',
      'education',
      'defense',
      'energy',
      'entertainment',
      'law',
    ];

    const initialIndustries = industries.map(industry => ({ name: industry, value: 0 }));

    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const voteSheet = await db.collection('voteSheet').insertOne({
      name,
      industries: initialIndustries
    });

    client.close();

    res.status(201).json(voteSheet);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


// Function to add a vote to a specific industry on a vote sheet
const addVote = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const { name, industry } = req.query;

    // Find the vote sheet by name
    const voteSheet = await db.collection('voteSheet').findOne({ name });

    if (!voteSheet) {
      client.close();
      return res.status(404).json({ message: 'Vote sheet not found' });
    }

    // Find the specific industry in the industries array
    const targetIndustry = voteSheet.industries.find((item) => item.name === industry);

    if (!targetIndustry) {
      client.close();
      return res.status(404).json({ message: 'Industry not found' });
    }

    // Increment the value for the specific industry
    targetIndustry.value++;

    // Update the vote sheet with the modified industries array
    await db.collection('voteSheet').findOneAndUpdate(
      { name },
      { $set: { industries: voteSheet.industries } },
      { returnOriginal: false }
    );

    client.close();

    // Create a response object with industries as key-value pairs
    const industriesResponse = {};
    voteSheet.industries.forEach((item) => {
      industriesResponse[item.name] = item.value;
    });

    res.status(200).json(industriesResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


// Function to delete a vote from a specific industry on a vote sheet
const deleteVote = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const { name, industry } = req.query;

    // Find the vote sheet by name
    const voteSheet = await db.collection('voteSheet').findOne({ name });

    if (!voteSheet) {
      client.close();
      return res.status(404).json({ message: 'Vote sheet not found' });
    }

    // Find the specific industry in the industries array
    const targetIndustry = voteSheet.industries.find((item) => item.name === industry);

    if (!targetIndustry) {
      client.close();
      return res.status(404).json({ message: 'Industry not found' });
    }

    // Decrement the value for the specific industry
    if (targetIndustry.value > 0) {
      targetIndustry.value--;
    }

    // Update the vote sheet with the modified industries array
    await db.collection('voteSheet').findOneAndUpdate(
      { name },
      { $set: { industries: voteSheet.industries } },
      { returnOriginal: false }
    );

    client.close();

    // Create a response object with industries as key-value pairs
    const industriesResponse = {};
    voteSheet.industries.forEach((item) => {
      industriesResponse[item.name] = item.value;
    });

    res.status(200).json(industriesResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


// Function to get the value of a specific industry by name
const getIndustryValueByName = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const industryName = req.query.name;

    // Retrieve the industry value by name
    const data = await db.collection('voteSheet').find().toArray();

    let totalValue = 0;

    data.forEach((sheet) => {
      const industryData = sheet.industries.find((item) => item.name === industryName);
      if (industryData) {
        totalValue += industryData.value;
      }
    });

    client.close();

    res.status(200).json({ industryName, value: totalValue });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


  // Function to retrieve a vote sheet by its Name
const getVoteSheet = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const sheetName = req.query.name;

    // Retrieve the vote sheet by name
    const voteSheet = await db.collection('voteSheet').findOne({ name: sheetName });

    client.close();

    if (!voteSheet) {
      return res.status(404).json({ message: 'Vote sheet not found' });
    }

    res.status(200).json(voteSheet);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  

// Function to calculate the average votes for each industry
const getAvgVotesPerIndustry = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const industries = [
      'computer',
      'finance',
      'manufacturing',
      'agriculture',
      'medical',
      'education',
      'defense',
      'energy',
      'entertainment',
      'law',
    ];

    const data = await db.collection('voteSheet').find().toArray();

    let totalVotes = 0;

    industries.forEach((industry) => {
      // Calculate the total votes for the industry across all sheets
      totalVotes += data.reduce((total, sheet) => {
        const industryData = sheet.industries.find((item) => item.name === industry);
        return total + (industryData ? industryData.value : 0);
      }, 0);
    });

    // Calculate the overall average by dividing the total votes by the number of industries
    const overallAverage = totalVotes / industries.length;

    client.close();

    res.status(200).json({ overallAverage });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


// Function to calculate the overall median votes across all industries
const getMedianVotesPerIndustry = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const industries = [
      'computer',
      'finance',
      'manufacturing',
      'agriculture',
      'medical',
      'education',
      'defense',
      'energy',
      'entertainment',
      'law',
    ];

    const data = await db.collection('voteSheet').find().toArray();

    // Initialize an array to store all votes for calculating the overall median
    const allVotes = [];

    industries.forEach((industry) => {
      // Get the votes for the industry across all sheets
      const votesArr = data.map((sheet) => {
        const industryData = sheet.industries.find((item) => item.name === industry);
        return industryData ? industryData.value : 0;
      });

      allVotes.push(...votesArr);
    });

    // Sort the votes array
    allVotes.sort((a, b) => a - b);

    // Calculate the overall median
    const medianIndex = Math.floor(allVotes.length / 2);
    const overallMedian = allVotes.length % 2 === 0
      ? (allVotes[medianIndex - 1] + allVotes[medianIndex]) / 2
      : allVotes[medianIndex];

    client.close();

    res.status(200).json({ overallMedian });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


// Function to calculate the overall range (highest and lowest votes) across all industries
const getMinMaxVotesPerIndustry = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const industries = [
      'computer',
      'finance',
      'manufacturing',
      'agriculture',
      'medical',
      'education',
      'defense',
      'energy',
      'entertainment',
      'law',
    ];

    const data = await db.collection('voteSheet').find().toArray();

    // Initialize variables to store the highest and lowest votes
    let highestVotes = -Infinity;
    let lowestVotes = Infinity;

    industries.forEach((industry) => {
      // Get the votes for the industry across all sheets
      const votesArr = data.map((sheet) => {
        const industryData = sheet.industries.find((item) => item.name === industry);
        return industryData ? industryData.value : 0;
      });

      // Calculate the highest and lowest values
      const max = Math.max(...votesArr);
      const min = Math.min(...votesArr);

      // Update the overall highest and lowest values if needed
      if (max > highestVotes) {
        highestVotes = max;
      }
      if (min < lowestVotes) {
        lowestVotes = min;
      }
    });

    client.close();

    res.status(200).json({ highestVotes, lowestVotes });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


// Function to delete a vote sheet by its Name
const deleteVoteSheetByName = async (req, res) => {
  try {
    const client = await mongoClient.connect(url);

    const db = client.db('Ref');

    const sheetName = req.query.name;

    // Check if the vote sheet exists
    const voteSheet = await db.collection('voteSheet').findOne({ name: sheetName });

    if (!voteSheet) {
      client.close();
      return res.status(404).json({ message: 'Vote sheet not found' });
    }

    // Delete the vote sheet by name
    await db.collection('voteSheet').deleteOne({ name: sheetName });

    client.close();

    res.status(200).json({ message: 'Vote sheet deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 

module.exports = {
    voteSheetPost,
    addVote,
    deleteVote,
    getVoteSheet,
    getIndustryValueByName,
    getAvgVotesPerIndustry,
    getMedianVotesPerIndustry,
    getMinMaxVotesPerIndustry,
    deleteVoteSheetByName
}