import React, { Component } from 'react';
import Chart from 'react-apexcharts';

const TrafficStages = [
  {
    label: 'Applied',
    value: 30,
    color: '#00E396', // Custom color for Applied
  },
  {
    label: 'Shortlisted',
    value: 20,
    color: 'blue', // Custom color for Shortlisted
  },
  {
    label: 'Interviewed',
    value: 10,
    color: '#f7dc6f', // Custom color for Interviewed
  },
  {
    label: 'In Review',
    value: 40,
    color: 'orange', // Custom color for In Review
  },
];

class Donut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: TrafficStages.map(stage => stage.label),
        colors: TrafficStages.map(stage => stage.color),
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          formatter: (val, opts) => {
            return `${opts.w.globals.series[opts.seriesIndex]}%`;
          }
        }
      },
      series: TrafficStages.map(stage => stage.value)
    };
  }

  render() {
    return (
      <div className="donut">
        <Chart options={this.state.options} series={this.state.series} type="donut" width="380" />
      </div>
    );
  }
}

export default Donut;