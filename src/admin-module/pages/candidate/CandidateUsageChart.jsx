import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
// import StackedBarChart from './CandidateChart';

const valueFormatter = (value) => `${value}%`;

export default function CandidateUsageChart({ candidates }) {
  const [radius, setRadius] = React.useState(50);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const candidateStages = [
    {
      label: 'Approved',
      value: candidates.filter(c => c.status === 'approved').length,
      color: 'green',
    },
    {
      label: 'Rejected',
      value: candidates.filter(c => c.status === 'rejected').length,
      color: 'red',
    },
    {
      label: 'Suspended',
      value: candidates.filter(c => c.status === 'suspend').length,
      color: 'blue',
    },
    {
      label: 'Pending',
      value: candidates.filter(c => c.status === 'pending').length,
      color: 'yellow',
    },
  ];

  return (
    <Box className="w-full flex flex-col items-center">
      <Box className="w-full flex justify-around flex-wrap">
        <Box className="w-full md:w-1/2 p-2">
          <PieChart
            height={250}
            series={[
              {
                data: candidateStages,
                innerRadius: radius,
                arcLabel: (params) => params.label ?? '',
                arcLabelMinAngle: 30,
                valueFormatter,
                color: candidateStages.map(stage => stage.color),
              },
            ]}
            skipAnimation={skipAnimation}
          />

          <Box>
            {candidateStages.map((stage) => (
              <Typography key={stage.label}>
                {stage.label}: {stage.value}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box className="w-full md:w-1/2 p-2">
          {/* <StackedBarChart /> */}
        </Box>
      </Box>
    </Box>
  );
}
