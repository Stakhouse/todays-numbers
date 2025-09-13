import React, { useState } from 'react';
import { Container, Typography, Box, Chip } from '@mui/material';
import TodaysNumbers from '../TodaysNumbers';
import ErrorBoundary from '../ErrorBoundary';
import JamaicaLotteryResults from '../JamaicaLotteryResults';
import IslandTabs from '../IslandTabs';
import IslandDetailsModal from '../IslandDetailsModal';
import { ISLANDS, Island } from '../../context/IslandContext';

const TodaysNumbersPage: React.FC = () => {
  // Check if Jamaica is in the selected islands
  const includesJamaica = true; // For now, we'll always show Jamaica
  
  // State for selected island
  const [selectedIsland, setSelectedIsland] = useState<Island>(ISLANDS[0]);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle island selection
  const handleIslandSelect = (island: Island) => {
    setSelectedIsland(island);
  };
  
  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}> {/* Added pb to account for fixed tabs */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Today's Caribbean Lottery Numbers
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Live lottery results from Caribbean islands
        </Typography>
      </Box>
      
      {includesJamaica ? (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h4" component="h2">
              Featured: Jamaica Lottery Results
            </Typography>
            <Chip label="LIVE" color="success" size="small" />
          </Box>
          <ErrorBoundary>
            <JamaicaLotteryResults />
          </ErrorBoundary>
        </Box>
      ) : null}
      
      {/* Lottery card that opens modal when clicked */}
      <Box 
        onClick={handleOpenModal}
        sx={{ 
          cursor: 'pointer',
          mb: 2,
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease'
          }
        }}
      >
        <ErrorBoundary>
          <TodaysNumbers selectedIslands={[selectedIsland.id]} />
        </ErrorBoundary>
      </Box>
      
      {/* Island Tabs at the bottom */}
      <IslandTabs 
        onIslandSelect={handleIslandSelect} 
        selectedIslandId={selectedIsland.id} 
      />
      
      {/* Island Details Modal */}
      <IslandDetailsModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        islandId={selectedIsland.id} 
      />
    </Container>
  );
};

export default TodaysNumbersPage;