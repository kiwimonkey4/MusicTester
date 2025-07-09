// Include necessary frameworks and libraries using the CommonJS module system
const express = require('express'); // Framework to set up urls and handle http requests
const cors = require('cors'); // Cross-Origin Resource Sharing middleware to allow requests from different origins (lets backend and frontend communicate)
const mm = require('@magenta/music/node/music_rnn'); // Import MusicaRNN model

const app = express(); // Defines server as an instance of the Express framework
const port = 3001; // Network port which we will listen to http requests on 

// Allow communication between frontend and backend + handle JSON requests
app.use(cors());
app.use(express.json());

// Initialize the MusicRNN model with weights and configurations from pre-trained checkpoints
const modelCheckpoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn';
const model = new mm.MusicRNN(modelCheckpoint);

// Handle POST requests at the '/generate' endpoint
app.post('/generate', async (req, res) => {
  try {
    // Initialize the model if it hasn't been initialized yet
    await model.initialize();

    // Creates a NoteSequence object which acts as a seed for music generation
    const seed = {
      notes: [
        { pitch: 60, startTime: 0, endTime: 0.5 }
      ],
      totalTime: 0.5
    };

    // Generate a continued NoteSequence based on the seed and store this response as a JSON object
    const generated = await model.continueSequence(seed, 20, 1.0);
    res.json(generated);
  } catch (error) {

    // 500 status code if there was an error 
    console.error('Error generating music:', error);
    res.status(500).send('Generation failed');
  }
});

// Start the server and listen for incoming requests on the specified port 
app.listen(port, () => {
  console.log(`🎵 Magenta MelodyRNN backend listening at http://localhost:${port}`);
});
