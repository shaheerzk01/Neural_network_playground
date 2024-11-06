import React, { useState, useEffect } from "react";
import ControlPanel from "./components/controlPanel";
import LineChart from "./components/LineChart";
import HeatmapChart from "./components/HeatmapChart";
import LossChart from "./components/LossChart";
import {
  createModel,
  trainModel,
  generateBoundaryData,
} from "./utils/neuralNetwork";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [numLayers, setNumLayers] = useState(2);
  const [numNeurons, setNumNeurons] = useState(5);
  const [activation, setActivation] = useState("relu");
  const [layerActivations, setLayerActivations] = useState(Array(numLayers).fill("relu"));
  const [accuracyData, setAccuracyData] = useState([]);
  const [lossData, setLossData] = useState([]); // Add lossData state
  const [boundaryData, setBoundaryData] = useState([]);
  const [pointSize, setPointSize] = useState(0.1);
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(10);
  const [optimizer, setOptimizer] = useState("adam");
  const [useScheduler, setUseScheduler] = useState(false);

  useEffect(() => {
    setLayerActivations(Array(numLayers).fill("relu"));
  }, [numLayers]);

  function generateXORData(numPoints = 100) {
    const inputs = [];
    const labels = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random();
      const y = Math.random();
      const label = x > 0.5 !== y > 0.5 ? 1 : 0; // XOR logic
      inputs.push([x, y]);
      labels.push([label]);
    }
    return {
      inputs: tf.tensor2d(inputs),
      labels: tf.tensor2d(labels),
    };
  }

  useEffect(() => {
    const runModel = async () => {
      setAccuracyData([]);
      setLossData([]); // Clear lossData before each training run

      const { inputs, labels } = generateXORData(100);

      const model = createModel(
        numLayers,
        numNeurons,
        activation,
        layerActivations,
        learningRate,
        optimizer
      );

      await trainModel(
        model,
        inputs,
        labels,
        epochs,
        batchSize,
        (logs) => {
          setAccuracyData((prev) => [...prev, parseFloat(logs.acc.toFixed(2))]);
          setLossData((prev) => [...prev, parseFloat(logs.loss.toFixed(2))]); // Track loss data
        },
        useScheduler
      );

      setBoundaryData(generateBoundaryData(model));
    };

    runModel();
  }, [
    numLayers,
    numNeurons,
    activation,
    layerActivations,
    batchSize,
    epochs,
    learningRate,
    optimizer,
    useScheduler,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">
        Neural Network Playground
      </h1>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <ControlPanel
          numLayers={numLayers}
          setNumLayers={setNumLayers}
          numNeurons={numNeurons}
          setNumNeurons={setNumNeurons}
          activation={activation}
          setActivation={setActivation}
          layerActivations={layerActivations}
          setLayerActivations={setLayerActivations}
          pointSize={pointSize}
          setPointSize={setPointSize}
          learningRate={learningRate}
          setLearningRate={setLearningRate}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          epochs={epochs}
          setEpochs={setEpochs}
          optimizer={optimizer}
          setOptimizer={setOptimizer}
          useScheduler={useScheduler}
          setUseScheduler={setUseScheduler}
        />
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 space-y-6">
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Model Accuracy Over Epochs
            </h2>
            <LineChart accuracyData={accuracyData} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Decision Boundary Heatmap
            </h2>
            <HeatmapChart boundaryData={boundaryData} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Model Loss Over Epochs
            </h2>
            <LossChart lossData={lossData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
