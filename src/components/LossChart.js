// src/components/LossChart.js
import React from 'react';
import Chart from 'react-apexcharts';

export default function LossChart({ lossData }) {
  const series = [{ name: 'Loss', data: lossData }];
  const options = {
    chart: { type: 'line', height: 350 },
    xaxis: { title: { text: 'Epochs' }, categories: lossData.map((_, index) => index + 1) },
    yaxis: { title: { text: 'Loss' } },
    colors: ['#FF0000'],
    stroke: { curve: 'smooth' },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
}
