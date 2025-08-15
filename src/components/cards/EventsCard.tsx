import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface EventsCardProps {
  islandId: string;
}

const mockEventsData: { [key: string]: any } = {
  'st-vincent': {
    'Vincy Mas': 'July 1 - July 12',
    'Bequia Music Fest': 'Jan 25 - Jan 29',
  },
  'st-lucia': {
    'Jazz Festival': 'May 5 - May 14',
    'Carnival': 'July 15 - July 19',
  },
  'dominica': {
    'World Creole Music Festival': 'Oct 27 - Oct 29',
    'Mas Domnik': 'Feb 20 - Feb 21',
  },
  'grenada': {
    'Spice Mas': 'Aug 14 - Aug 15',
    'Grenada Chocolate Fest': 'May 12 - May 21',
  },
  'trinidad': {
    'Carnival': 'Feb 12 - Feb 13',
    'Tobago Jazz Experience': 'Apr 20 - Apr 23',
  },
};

const EventsCard: React.FC<EventsCardProps> = ({ islandId }) => {
  const data = mockEventsData[islandId] || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        {Object.keys(data).map((item) => (
          <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">{item}</Typography>
            <Typography variant="body2">{data[item]}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventsCard;