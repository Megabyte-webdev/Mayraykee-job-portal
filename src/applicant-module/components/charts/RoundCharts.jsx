import React from "react";
import Chart from "react-apexcharts"; // Assuming you're using React ApexCharts

const RoundChart = ({ data }) => {
  // Count applications by status
  const applicationStatuses = data?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the chart
  const chartData = {
    series: Object?.values(applicationStatuses || {}), // Counts of each status
    options: {
      chart: {
        type: "donut",
        width: "100%",
      },
      labels: Object.keys(applicationStatuses || {}), // Status labels
      colors: ["#FF4560", "#00E396", "#FEB019", "#008FFB"], // Colors for each section
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
      },
    },
  };

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width="100%"
      />
    </div>
  );
};

export default RoundChart;
