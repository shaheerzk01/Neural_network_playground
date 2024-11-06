// src/components/LineChart.js
import React from 'react';
import Chart from 'react-apexcharts';

export default function LineChart({ accuracyData }) {
  const series = [
    {
      name: 'Accuracy',
      data: accuracyData
    }
  ];

  const options = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      title: { text: 'Epochs' },
      categories: accuracyData.map((_, index) => index + 1)
    },
    yaxis: {
      title: { text: 'Accuracy' },
      min: 0,
      max: 1
    },
    colors: ['#00BFFF'],
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7'
    }
  };

  return (
    <div className="chart">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
