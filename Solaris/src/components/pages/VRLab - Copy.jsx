import React from "react";
import { 
  Typography,
  Container,
  Paper,
  Box,
  Button
} from "@mui/material";
import {
  ExternalLink,
  Stethoscope,
  UserPlus,
  Clipboard,
  Activity,
  LifeBuoy
} from "lucide-react";
import "./VRLab.css";

// Use proper yellow color
const THEME_COLOR = "#e6b400";

// Simplified VR Lab component focused only on Clinical VR
const VRLab = () => {
  // Function to open Clinic VR in a new window
  const handleOpenClinicVR = () => {
    window.open('https://api2.enscape3d.com/v1/view/0c0cb551-20c3-4ceb-b979-6373fd702c01', '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="xl" className="vr-lab-container">
      <div className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Solaris Clinic VR
        </Typography>
        <Button 
          variant="contained" 
          className="launch-vr-button"
          onClick={handleOpenClinicVR}
          startIcon={<ExternalLink size={18} />}
          sx={{ backgroundColor: THEME_COLOR }}
        >
          Launch Clinic VR
        </Button>
      </div>
      
      <Typography variant="subtitle1" className="page-subtitle">
        Experience clinical scenarios in an immersive virtual environment
      </Typography>

      {/* Hero section with VR image and CTA */}
      <Paper elevation={0} className="hero-section">
        <Box className="hero-content">
          <Typography variant="h5" component="h2" gutterBottom>
            Virtual Reality Clinical Training
          </Typography>
          <Typography variant="body1" paragraph>
            Practice clinical skills, patient interactions, and diagnostic procedures in our 
            state-of-the-art virtual clinic environment. Solaris Clinic VR provides realistic 
            scenarios that prepare you for real-world medical practice.
          </Typography>
         
          <Typography variant="body2" className="system-requirements">
            Requires Chrome or Edge browser. For best experience, use with compatible VR headset.
          </Typography>
        </Box>
        <Box className="hero-image-container">
          <img 
            src="/images/clinic-vr-preview.jpg" 
            alt="Clinic VR Preview" 
            className="hero-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400/e6b400/ffffff?text=Clinic+VR";
            }}
          />
        </Box>
      </Paper>

      {/* Features section */}
      <Typography variant="h5" component="h2" className="section-title">
        Features
      </Typography>
      
      <Box className="features-grid">
        <Paper className="feature-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <Stethoscope size={32} color={THEME_COLOR} />
            <Typography variant="h6" component="h3">
              Clinical Examination
            </Typography>
            <Typography variant="body2">
              Practice physical examination techniques with realistic patient responses
            </Typography>
          </Box>
        </Paper>

        <Paper className="feature-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <UserPlus size={32} color={THEME_COLOR} />
            <Typography variant="h6" component="h3">
              Patient Interaction
            </Typography>
            <Typography variant="body2">
              Develop communication skills with virtual patients in various scenarios
            </Typography>
          </Box>
        </Paper>

        <Paper className="feature-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <Clipboard size={32} color={THEME_COLOR} />
            <Typography variant="h6" component="h3">
              Case Management
            </Typography>
            <Typography variant="body2">
              Work through complete clinical cases from intake to treatment
            </Typography>
          </Box>
        </Paper>

        <Paper className="feature-card" elevation={0}>
          <Box sx={{ p: 2 }}>
            <Activity size={32} color={THEME_COLOR} />
            <Typography variant="h6" component="h3">
              Diagnostic Tools
            </Typography>
            <Typography variant="body2">
              Use virtual medical equipment and interpret diagnostic results
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* How to access section */}
      <Paper elevation={1} className="access-guide">
        <Box className="access-guide-content">
          <Typography variant="h5" component="h2" gutterBottom>
            How to Access
          </Typography>
          <Typography variant="body1" paragraph>
            The Clinic VR application opens in a new browser window and can be used with or 
            without a VR headset. For the full immersive experience, connect your VR headset 
            before launching.
          </Typography>
          <Box className="access-steps">
            <div className="step">
              <div className="step-number">1</div>
              <Typography variant="body1">Click the "Launch Clinic VR" button above</Typography>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <Typography variant="body1">Allow browser permissions for VR when prompted</Typography>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <Typography variant="body1">Select a clinical scenario from the available options</Typography>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <Typography variant="body1">Follow the on-screen instructions to begin</Typography>
            </div>
          </Box>
        </Box>
        <div className="help-box">
          <LifeBuoy size={24} color={THEME_COLOR} />
          <div>
            <Typography variant="body1" fontWeight="500">Need help?</Typography>
            <Typography variant="body2">
              Contact technical support at <a href="mailto:vr-support@solaris-med.edu">vr-support@solaris-med.edu</a> 
              or visit the <a href="/help/vr-guide">VR User Guide</a>
            </Typography>
          </div>
        </div>
      </Paper>

      {/* Floating action button for mobile */}
      <Button 
        variant="contained" 
        className="floating-launch-button"
        onClick={handleOpenClinicVR}
        startIcon={<ExternalLink size={18} />}
        sx={{ 
          backgroundColor: THEME_COLOR,
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        Launch Clinic VR
      </Button>
    </Container>
  );
};

export default VRLab;