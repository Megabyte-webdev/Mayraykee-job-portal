import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const options = [
  "Overview",
  "In-Review Applicants",
  "Shortlisted Applicants",
  "Interviewed Applicants",
  "Onboarded Applicants",
  "Declined Applicants"
];

function JobStatistic({ applicants, byCategory }) {
  const [active, setActive] = useState(options[0]);

  const filterApplicants = (status) => {
    switch (status) {
      case "Declined Applicants":
        return applicants.filter((app) => app.status === "declined");
      case "Shortlisted Applicants":
        return applicants.filter((app) => app.status === "shortlist");
      case "In-Review Applicants":
        return applicants.filter((app) => app.status === "in-review");
      case "Interviewed Applicants":
        return applicants.filter((app) => app.status === "interview");
      case "Onboarded Applicants":
        return applicants.filter((app) => app.status === "hired");
      default:
        return applicants; // Overview includes all
    }
  };

  const generateChartData = () => {
    const filteredApplicants = filterApplicants(active);

    if (active === "Overview") {
      const applicantByStatus = { declined: [], shortlist: [], hired: [], interview: [], inReview: [] };

      Object.keys(byCategory).forEach((cat) => {
        const jobId = byCategory[cat][0].job_id;
        const jobTitle = byCategory[cat][0].job_title;

        applicantByStatus.declined.push({
          jobTitle,
          count: applicants.filter(
            (app) => app.job_id === jobId && app.status === "declined"
          ).length,
        });
        applicantByStatus.interview.push({
          jobTitle,
          count: applicants.filter(
            (app) => app.job_id === jobId && app.status === "interview"
          ).length,
        });
        applicantByStatus.inReview.push({
          jobTitle,
          count: applicants.filter(
            (app) => app.job_id === jobId && app.status === "in-review"
          ).length,
        });
        applicantByStatus.shortlist.push({
          jobTitle,
          count: applicants.filter(
            (app) => app.job_id === jobId && app.status === "shortlist"
          ).length,
        });
        applicantByStatus.hired.push({
          jobTitle,
          count: applicants.filter(
            (app) => app.job_id === jobId && app.status === "hired"
          ).length,
        });
      });

      return {
        categories: Object.keys(byCategory).map((cat) => byCategory[cat][0].job_title),
        series: [
          {
            name: "Rejected",
            data: applicantByStatus.declined.map((item) => item.count),
          },
          {
            name: "Interviewed",
            data: applicantByStatus.interview.map((item) => item.count),
          },
          {
            name: "Shortlisted",
            data: applicantByStatus.shortlist.map((item) => item.count),
          },
          {
            name: "InReview",
            data: applicantByStatus.inReview.map((item) => item.count),
          },
          {
            name: "Onboarded",
            data: applicantByStatus.hired.map((item) => item.count),
          },
        ],
      };
    }

    const applicantByCategory = {};
    Object.keys(byCategory).forEach((cat) => {
      const jobApplicants = filteredApplicants.filter(
        (app) => app.job_id === byCategory[cat][0].job_id
      );
      applicantByCategory[byCategory[cat][0].job_title] = jobApplicants.length;
    });

    return {
      categories: Object.keys(applicantByCategory),
      series: Object.values(applicantByCategory),
    };
  };

  const chartData = generateChartData();

  const getChartConfig = () => {
    const colorPalette = {
      Rejected: "#FF0000", // Tomato Red
      Interviewed: "#FFFF00", // Yellow
      InReview: "#FFA500", // Orange
      Shortlisted: "#03055B", // Lime Green
      Onboarded: "#32CD32", // Navy Blue
      default: "#1E90FF", // Dodger Blue for other cases
    };

    // For the Overview tab
    if (active === "Overview") {
      return {
        options: {
          chart: { type: "bar", stacked: true, toolbar: { show: false } },
          xaxis: {
            categories: chartData.categories,
            labels: {
              rotate: -45,
              style: { fontSize: "10px" },
            },
          },
          plotOptions: {
            bar: {
              columnWidth: "50%",
              barHeight: "80%", // Adjusted bar height
              dataLabels: { position: "top" },
            },
          },
          responsive: [
            {
              breakpoint: 768,
              options: {
                xaxis: { labels: { rotate: -30, style: { fontSize: "8px" } } },
                legend: { position: "bottom" },
              },
            },
          ],
          colors: [
            colorPalette.Rejected,
            colorPalette.Interviewed,
            colorPalette.Shortlisted, // Use Shortlisted's color for the 3rd series
            colorPalette.InReview,
            colorPalette.Onboarded, // Use Onboarded's color for the 5th series
          ],
          title: { text: "Overview of All Applicants", style: { fontSize: "16px" } },
          legend: {
            position: "top",
            horizontalAlign: "center",
            formatter: (seriesName, opts) => {
              switch (seriesName) {
                case "Rejected":
                  return `${seriesName}: ${chartData.series[0].data.reduce(
                    (a, b) => a + b,
                    0
                  )}`;
                case "Interviewed":
                  return `${seriesName}: ${chartData.series[1].data.reduce(
                    (a, b) => a + b,
                    0
                  )}`;
                case "Shortlisted":
                  return `${seriesName}: ${chartData.series[2].data.reduce(
                    (a, b) => a + b,
                    0
                  )}`;
                case "InReview":
                  return `${seriesName}: ${chartData.series[3].data.reduce(
                    (a, b) => a + b,
                    0
                  )}`;
                case "Onboarded":
                  return `${seriesName}: ${chartData.series[4].data.reduce(
                    (a, b) => a + b,
                    0
                  )}`;
                default:
                  return seriesName;
              }
            },
          },
        },
        series: chartData.series,
      };
    }

    // For other tabs (like "Declined Applicants", "Interviewed Applicants", etc.)
    const dynamicColors = chartData.categories.map((category) => {
      switch (category) {
        case "Declined Applicants":
          return colorPalette.Rejected; // Rejected applicants will be red
        case "Interviewed Applicants":
          return colorPalette.Interviewed; // Interviewed will be yellow
        case "Shortlisted Applicants":
          return colorPalette.Shortlisted; // Shortlisted will be lime green
        case "In-Review Applicants":
          return colorPalette.InReview; // In-review will be orange
        case "Onboarded Applicants":
          return colorPalette.Onboarded; // Onboarded will be navy green
        default:
          return colorPalette.default; // Default case, fallback color
      }
    });

    return {
      options: {
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
          categories: chartData.categories,
          labels: {
            rotate: -45,
            style: { fontSize: "10px" },
          },
        },
        plotOptions: {
          bar: { columnWidth: "50%", barHeight: "80%" },
        },
        colors: dynamicColors, // Apply the dynamic colors for the other tabs
        title: { text: `${active} by Job`, style: { fontSize: "16px" } },
      },
      series: [
        {
          name: active,
          data: chartData.series,
        },
      ],
    };
  };

  const chartConfig = getChartConfig();

  return (
    <div className="border h-fit md:h-full w-full md:w-[65%]">
      <div className="h-[28%] border-b px-2 justify-between pt-1 flex flex-col">
        <div className="w-full justify-between flex">
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">Job Statistics</h3>
            <span className="text-gray-400 text-little">
              Showing statistics for {active}
            </span>
          </div>
        </div>
        <div className="flex gap-5 border-b overflow-x-auto">
          {options?.map((current, index) => (
            <h3
              key={index}
              onClick={() => setActive(current)}
              className={`text-little py-1 border-b cursor-pointer ${
                active === current ? "border-primaryColor" : ""
              } w-fit font-semibold`}
            >
              {current}
            </h3>
          ))}
        </div>
      </div>
      <div className="w-full p-2 items-center flex h-fit justify-center overflow-x-auto">
        {chartConfig ? (
          <ReactApexChart
            options={chartConfig.options}
            series={chartConfig.series}
            type={chartConfig.options.chart.type}
            height={Math.min(
              500,
              Math.max(300, chartData.categories.length * 40)
            )} // Dynamic height
          />
        ) : (
          <span>No data available</span>
        )}
      </div>
    </div>
  );
}

export default JobStatistic;
        
