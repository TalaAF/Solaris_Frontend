import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  Tab, 
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import {
  Brain,
  Calendar,
  BookOpen,
  X,
  Clock,
  GraduationCap,
  Users
} from "lucide-react";
// Remove the problematic import
// import { useSidebar } from "../../context/SidebarContext";
import SimulationCard from "../vr/SimulationCard";
import "./VRLab.css";

// Use proper yellow color instead of orange
const THEME_COLOR = "#eab308";

// Simulation data
const simulations = [
  {
    id: 1,
    title: "Human Anatomy Explorer",
    description: "Explore the human body in 3D VR environment with detailed organs and systems.",
    duration: 45,
    level: "Intermediate",
    participants: "Individual",
    category: "Anatomy",
    code: "VRMED101"
  },
  {
    id: 2,
    title: "Cardiovascular System Simulation",
    description: "Interact with a realistic heart model and observe blood flow in real-time.",
    duration: 60,
    level: "Advanced",
    participants: "Up to 4 students",
    category: "Physiology",
    code: "VRPHY202"
  },
  {
    id: 3,
    title: "Virtual Dissection Lab",
    description: "Practice dissection techniques in a risk-free virtual environment.",
    duration: 90,
    level: "Advanced",
    participants: "Individual or pairs",
    category: "Anatomy",
    code: "VRANA301"
  },
  {
    id: 4,
    title: "Surgical Procedures Training",
    description: "Step-by-step guidance through common surgical procedures with haptic feedback.",
    duration: 120,
    level: "Advanced",
    participants: "Individual",
    category: "Surgery",
    code: "VRSUR401"
  },
];

// Main VR Lab component
const VRLab = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  
  // Replace the sidebar context with a prop from Layout component or window resize detection
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  // Add a resize listener to detect sidebar state changes based on window width
  useEffect(() => {
    const handleResize = () => {
      // This is a simplistic approach - if your app has actual sidebar state management,
      // you'll need to connect to that instead
      setIsSidebarOpen(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // These effects can stay, using the local isSidebarOpen state
  useEffect(() => {
    const contentWidth = isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 70px)";
    document.documentElement.style.setProperty("--content-width", contentWidth);
  }, [isSidebarOpen]);

  useEffect(() => {
    const cardWidth = isSidebarOpen ? "390px" : "330px";
    document.documentElement.style.setProperty("--card-width", cardWidth);
  }, [isSidebarOpen]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenSimulation = (simulation) => {
    setSelectedSimulation(simulation);
    setOpenModal(true);
  };

  // Filter simulations based on the selected tab
  const getFilteredSimulations = () => {
    if (tabValue === 0) return simulations; // VR Simulations
    if (tabValue === 1) return []; // Lab Schedule
    return []; // Tutorials
  };

  return (
    <Container maxWidth="xl" className="vr-lab-container">
      <div className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Virtual Reality Lab
        </Typography>
        <Button variant="contained" className="schedule-button">
          Schedule Session
        </Button>
      </div>
      
      <Typography variant="subtitle1" className="page-subtitle">
        Immersive learning experiences for medical education
      </Typography>

      <Box className="tab-container">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="VR lab tabs"
          variant="fullWidth"
          className="vr-tabs"
        >
          <Tab 
            icon={<Brain size={18} color={THEME_COLOR} />} 
            label="VR SIMULATIONS" 
            className="vr-tab"
          />
          <Tab 
            icon={<Calendar size={18} color={THEME_COLOR} />} 
            label="LAB SCHEDULE" 
            className="vr-tab"
          />
          <Tab 
            icon={<BookOpen size={18} color={THEME_COLOR} />} 
            label="TUTORIALS" 
            className="vr-tab"
          />
        </Tabs>
      </Box>

      <Box className="tab-content">
        <div className="simulation-grid">
          {getFilteredSimulations().map((simulation) => (
            <div className="simulation-grid-item" key={simulation.id}>
              <SimulationCard 
                simulation={simulation}
                onLaunch={handleOpenSimulation}
                sidebarOpen={isSidebarOpen}
              />
            </div>
          ))}
          
          {/* Show message if no items in this tab */}
          {getFilteredSimulations().length === 0 && (
            <div className="empty-state-container">
              <Paper className="empty-state">
                <Typography variant="body1">
                  {tabValue === 1 ? 
                    "No lab schedules available at the moment." : 
                    "No tutorials available at the moment."}
                </Typography>
              </Paper>
            </div>
          )}
        </div>
      </Box>

      {/* Simulation launch modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        className="simulation-modal"
      >
        {selectedSimulation && (
          <>
            <DialogTitle className="modal-header">
              <div>
                <Typography variant="h5">{selectedSimulation.title}</Typography>
                <Chip label={selectedSimulation.category} size="small" className="modal-category" />
              </div>
              <Button 
                className="close-button" 
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </Button>
            </DialogTitle>
            
            <DialogContent className="modal-content">
              <Typography variant="body1" paragraph>
                {selectedSimulation.description}
              </Typography>

              <div className="preview-placeholder">
                <Typography variant="h3" className="preview-3d">3D</Typography>
                <Typography variant="h6" className="preview-text">Ready to Begin</Typography>
              </div>

              <div className="simulation-details">
                <div className="detail-item">
                  <Clock size={18} color={THEME_COLOR} />
                  <div>
                    <Typography variant="body2" className="detail-label">Duration</Typography>
                    <Typography variant="body1">{selectedSimulation.duration} min</Typography>
                  </div>
                </div>

                <div className="detail-item">
                  <GraduationCap size={18} color={THEME_COLOR} />
                  <div>
                    <Typography variant="body2" className="detail-label">Level</Typography>
                    <Typography variant="body1">{selectedSimulation.level}</Typography>
                  </div>
                </div>

                <div className="detail-item">
                  <Users size={18} color={THEME_COLOR} />
                  <div>
                    <Typography variant="body2" className="detail-label">Participants</Typography>
                    <Typography variant="body1">{selectedSimulation.participants}</Typography>
                  </div>
                </div>
              </div>

              <Typography variant="body2" className="equipment-note">
                Make sure your VR equipment is properly connected
              </Typography>
            </DialogContent>

            <DialogActions className="modal-actions">
              <Button 
                onClick={() => setOpenModal(false)} 
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                className="start-button"
              >
                START SIMULATION
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default VRLab;