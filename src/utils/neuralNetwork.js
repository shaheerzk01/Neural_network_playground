// src/utils/neuralNetwork.js
import * as tf from '@tensorflow/tfjs';

export function createModel(numLayers, numNeurons, activation, layerActivations, learningRate) {
  const model = tf.sequential();

  // Check if numLayers and numNeurons are greater than zero
  if (numLayers < 1 || numNeurons < 1) {
    throw new Error("Number of layers and neurons must be greater than zero.");
  }

  // Add input layer
  model.add(tf.layers.dense({ inputShape: [2], units: numNeurons, activation: layerActivations[0] || activation }));

  // Add hidden layers
  for (let i = 1; i < numLayers; i++) {
    model.add(tf.layers.dense({ units: numNeurons, activation: layerActivations[i] || activation }));
  }

  // Add output layer
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  // Compile model with specified learning rate
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}


export async function trainModel(model, inputs, labels, epochs, batchSize, onBatchEnd, useScheduler) {
  await model.fit(inputs, labels, {
    epochs,
    batchSize,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        onBatchEnd && onBatchEnd(logs);
      },
      ...(useScheduler && {
        onEpochBegin: (epoch) => {
          if (epoch > 0 && epoch % 10 === 0) {
            const currentLR = model.optimizer.learningRate;
            model.optimizer.learningRate = currentLR * 0.9;
          }
        },
      }),
    },
  });
}


// Generate boundary data for visualization
export function generateBoundaryData(model) {
  const boundaryData = [];
  
  // Generate a denser grid of points over the 2D space
  for (let x = 0; x <= 1; x += 0.02) {  // Smaller increments for higher density
    for (let y = 0; y <= 1; y += 0.02) {
      const prediction = model.predict(tf.tensor2d([[x, y]])).dataSync()[0];
      boundaryData.push({ x, y, prediction });
    }
  }

  return boundaryData;
}
