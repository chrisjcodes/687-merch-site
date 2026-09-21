'use client';

import { Box, Container, Typography, Paper } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { formatOrderWindowDate, getTimeUntil } from '@/lib/shopStatus';
import { useEffect, useState } from 'react';

interface ShopUpcomingProps {
  shopName: string;
  opensAt: Date;
}

export default function ShopUpcoming({ shopName, opensAt }: ShopUpcomingProps) {
  const [timeUntil, setTimeUntil] = useState(getTimeUntil(opensAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntil(getTimeUntil(opensAt));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [opensAt]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <ScheduleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Coming Soon
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            {shopName}
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
            Opens {formatOrderWindowDate(opensAt)}
          </Typography>
          {(timeUntil.days > 0 || timeUntil.hours > 0 || timeUntil.minutes > 0) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
              {timeUntil.days > 0 && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {timeUntil.days}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {timeUntil.days === 1 ? 'day' : 'days'}
                  </Typography>
                </Box>
              )}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {timeUntil.hours}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {timeUntil.hours === 1 ? 'hour' : 'hours'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {timeUntil.minutes}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {timeUntil.minutes === 1 ? 'minute' : 'minutes'}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
