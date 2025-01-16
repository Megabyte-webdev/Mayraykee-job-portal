import React from "react";
import Chart from "react-apexcharts";

const RoundChart = ({ data }) => {
  // Define the order and colors of statuses
  const statusOrder = ["in-review", "shortlist", "interview", "declined", "hired"];
  const statusColors = ["#FF9900", "#008FFB", "#FFFF00", "#8B0A1A", "#00E396"];

  // Count applications by status
  const applicationStatuses = data?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  // Ensure chart data respects the predefined order
  const chartData = {
    series: statusOrder.map((status) => applicationStatuses?.[status] || 0), // Counts of each status
    options: {
      chart: {
        type: "donut",
        width: "100%",
      },
      labels: statusOrder, // Status labels in order
      colors: statusColors, // Colors corresponding to statuses
      legend: {
        position: "bottom",
        labels: {
          colors: "#FFFFFF", // Set legend text color to white
        },
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
