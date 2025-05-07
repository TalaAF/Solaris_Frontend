import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const BarChart = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const colors = {
    Present: 'success.main',
    Absent: 'error.main',
    Late: 'warning.main'
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Stack spacing={1}>
        {Object.entries(data).map(([key, value]) => {
          const percentage = total ? (value / total) * 100 : 0;
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ width: 80 }}>{key}</Typography>
              <Box sx={{ flexGrow: 1, height: 20, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: colors[key],
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="body2">{value}%</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default BarChart;