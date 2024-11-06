import React from "react";

export default function ControlPanel({
  numLayers,
  setNumLayers,
  numNeurons,
  setNumNeurons,
  activation,
  setActivation,
  layerActivations,
  setLayerActivations,
  pointSize,
  setPointSize,
  learningRate,
  setLearningRate,
  batchSize,
  setBatchSize,
  epochs,
  setEpochs,
}) {
  const handleActivationChange = (index, value) => {
    const newActivations = [...layerActivations];
    newActivations[index] = value;
    setLayerActivations(newActivations);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-xs">
      <h3 className="text-sm font-semibold mb-4 text-blue-600">
        Control Panel
      </h3>

      <label className="block font-medium mb-2">Layers: {numLayers}</label>
      <input
        type="range"
        min="1"
        max="5"
        value={numLayers}
        onChange={(e) => setNumLayers(parseInt(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block font-medium mb-2">
        Neurons per Layer: {numNeurons}
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={numNeurons}
        onChange={(e) => setNumNeurons(parseInt(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block font-medium mb-2">Activation Function:</label>
      <select
        value={activation}
        onChange={(e) => setActivation(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      >
        <option value="relu">ReLU</option>
        <option value="sigmoid">Sigmoid</option>
        <option value="tanh">Tanh</option>
      </select>

      <label className="block font-medium mb-2">
        Learning Rate: {learningRate}
      </label>
      <input
        type="range"
        min="0.001"
        max="0.1"
        step="0.001"
        value={learningRate}
        onChange={(e) => setLearningRate(parseFloat(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block font-medium mb-2">Batch Size: {batchSize}</label>
      <input
        type="number"
        min="1"
        max="100"
        value={batchSize}
        onChange={(e) => setBatchSize(parseInt(e.target.value))}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      <label className="block font-medium mb-2">Epochs: {epochs}</label>
      <input
        type="number"
        min="1"
        max="100"
        value={epochs}
        onChange={(e) => setEpochs(parseInt(e.target.value))}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      {[...Array(numLayers)].map((_, i) => (
        <div key={i} className="mb-4">
          <label className="block font-medium">Layer {i + 1} Activation:</label>
          <select
            value={layerActivations[i] || activation}
            onChange={(e) => handleActivationChange(i, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
          </select>
        </div>
      ))}
    </div>
  );
}
