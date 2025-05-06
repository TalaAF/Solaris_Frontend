import React, { useState } from "react";
import { 
  Tabs, 
  Tab, 
  Box,
  Button,
  Typography
} from "@mui/material";
import { 
  Brain, 
  Heart, 
  Microscope, 
  Award,
  Clock, 
  Users as UsersIcon,
  GraduationCap
} from "lucide-react";
import SimulationCard from "../../components/vr/SimulationCard";
import SimulationModal from "../../components/vr/SimulationModal";
import "./VRLab.css";

const VRLab = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenSimulation = (simulation) => {
    setSelectedSimulation(simulation);
    setOpenModal(true);
  };

  const simulations = [
    {
      id: 1,
      title: "Human Anatomy Explorer",
      description: "Explore the human body in 3D VR environment with detailed organs and systems.",
      icon: <Brain size={48} color="#4a69dd" />,
      duration: 45,
      level: "Intermediate",
      participants: "Individual",
      category: "Anatomy",
    },
    {
      id: 2,
      title: "Cardiovascular System Simulation",
      description: "Interact with a realistic heart model and observe blood flow in real-time.",
      icon: <Heart size={48} color="#4a69dd" />,
      duration: 60,
      level: "Advanced",
      participants: "Up to 4 students",
      category: "Physiology",
    },
    {
      id: 3,
      title: "Virtual Dissection Lab",
      description: "Practice dissection techniques in a risk-free virtual environment.",
      icon: <Microscope size={48} color="#4a69dd" />,
      duration: 90,
      level: "Advanced",
      participants: "Individual or pairs",
      category: "Anatomy",
    },
    {
      id: 4,
      title: "Surgical Procedures Training",
      description: "Step-by-step guidance through common surgical procedures with haptic feedback.",
      icon: <Award size={48} color="#4a69dd" />,
      duration: 120,
      level: "Advanced",
      participants: "Individual",
      category: "Surgery",
    },
  ];

  // Filter simulations based on the selected tab
  const getFilteredSimulations = () => {
    if (tabValue === 0) return simulations; // All simulations
    if (tabValue === 1) return simulations; // VR Simulations
    if (tabValue === 2) return []; // Lab Schedule
    return []; // Tutorials
  };

  return (
    <div className="vr-lab-container">
      <div className="vr-lab-header">
        <div>
          <Typography variant="h2">Virtual Reality Lab</Typography>
          <Typography variant="subtitle1">
            Immersive learning experiences for medical education
          </Typography>
        </div>
        <Button variant="contained" color="primary" className="schedule-session-btn">
          Schedule Session
        </Button>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="VR lab tabs">
          <Tab 
            icon={<Brain size={20} />} 
            iconPosition="start" 
            label="VR Simulations" 
          />
          <Tab 
            icon={<Clock size={20} />} 
            iconPosition="start" 
            label="Lab Schedule" 
          />
          <Tab 
            icon={<GraduationCap size={20} />} 
            iconPosition="start" 
            label="Tutorials" 
          />
        </Tabs>
      </Box>

      <div className="simulation-grid">
        {getFilteredSimulations().map((simulation) => (
          <SimulationCard 
            key={simulation.id}
            simulation={simulation}
            onLaunch={() => handleOpenSimulation(simulation)}
          />
        ))}
      </div>

      <SimulationModal 
        open={openModal}
        onClose={() => setOpenModal(false)}
        simulation={selectedSimulation}
      />
    </div>
  );
};

export default VRLab;