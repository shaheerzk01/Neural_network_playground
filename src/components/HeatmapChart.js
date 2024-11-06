// src/components/HeatmapChart.js
import React from 'react';
import Chart from 'react-apexcharts';

export default function HeatmapChart({ boundaryData }) {
  const transformedData = boundaryData.reduce((acc, point) => {
    const xIndex = Math.round(point.x * 10); // scale up to create bins
    const yIndex = Math.round(point.y * 10);

    if (!acc[yIndex]) acc[yIndex] = { name: `Y ${yIndex}`, data: Array(11).fill(0) };
    acc[yIndex].data[xIndex] = point.prediction > 0.5 ? 1 : 0;
    return acc;
  }, []);

  const series = transformedData.reverse();

  const options = {
    chart: {
      type: 'heatmap',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: '#FF4500', name: 'Class 0' },
            { from: 1, to: 1, color: '#1E90FF', name: 'Class 1' }
          ]
        }
      }
    },
    xaxis: {
      title: { text: 'X Axis' },
      categories: Array.from({ length: 11 }, (_, i) => i / 10)
    },
    yaxis: {
      title: { text: 'Y Axis' },
      categories: Array.from({ length: 11 }, (_, i) => i / 10).reverse()
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top'
    }
  };

  return (
    <div className="chart">
      <Chart options={options} series={series} type="heatmap" height={350} />
    </div>
  );
}
