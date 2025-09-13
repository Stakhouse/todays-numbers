import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { Event, CalendarToday } from '@mui/icons-material';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface EventsCardProps {
  islandId: string;
}

// Fallback mock data for when no real data exists
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
  const [eventsData, setEventsData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time events from Firestore
    const q = query(
      collection(db, 'events'),
      where('islandId', '==', islandId),
      where('isActive', '==', true),
      orderBy('eventDate', 'asc'),
      limit(6) // Get next 6 upcoming events
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: { [key: string]: any } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const eventName = data.eventName || data.data?.event?.eventName;
        const eventDate = data.eventDate || data.data?.event?.eventDate;
        const venue = data.venue || data.data?.event?.venue;
        const ticketPrice = data.ticketPrice || data.data?.event?.ticketPrice;
        const currency = data.currency || data.data?.event?.currency || '$';
        const category = data.category || data.data?.event?.category;
        
        if (eventName && eventDate) {
          let dateStr: string;
          if (eventDate.toDate) {
            dateStr = eventDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            dateStr = new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          results[eventName] = {
            date: dateStr,
            venue: venue,
            price: ticketPrice ? `${currency}${ticketPrice}` : 'Free',
            category: category
          };
        }
      });

      // If no real data, use mock data as fallback
      if (Object.keys(results).length === 0) {
        const mockData: { [key: string]: any } = {};
        const mock = mockEventsData[islandId] || {};
        Object.keys(mock).forEach(key => {
          mockData[key] = { 
            date: mock[key], 
            venue: null, 
            price: null, 
            category: null 
          };
        });
        setEventsData(mockData);
      } else {
        setEventsData(results);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching events data:', error);
      // Fallback to mock data on error
      const mockData: { [key: string]: any } = {};
      const mock = mockEventsData[islandId] || {};
      Object.keys(mock).forEach(key => {
        mockData[key] = { 
          date: mock[key], 
          venue: null, 
          price: null, 
          category: null 
        };
      });
      setEventsData(mockData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [islandId]);

  const data = eventsData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Event sx={{ color: 'secondary.main' }} />
          <Typography variant="h6" color="primary">
            Upcoming Events
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : Object.keys(data).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No upcoming events
          </Typography>
        ) : (
          Object.keys(data).map((event) => (
            <Box key={event} sx={{ mb: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {event}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {data[event].date}
                      </Typography>
                    </Box>
                    {data[event].venue && (
                      <Typography variant="caption" color="text.secondary">
                        @ {data[event].venue}
                      </Typography>
                    )}
                    {data[event].category && (
                      <Chip label={data[event].category} size="small" color="secondary" />
                    )}
                  </Box>
                </Box>
                {data[event].price && (
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'secondary.dark' }}>
                    {data[event].price}
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;