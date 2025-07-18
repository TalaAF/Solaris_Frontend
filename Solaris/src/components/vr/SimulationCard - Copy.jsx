import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button 
} from '@mui/material';
import { 
  Clock, 
  GraduationCap, 
  Users 
} from 'lucide-react';
import './SimulationCard.css';

const THEME_COLOR = "#eab308";

const SimulationCard = ({ simulation, onLaunch, sidebarOpen = true }) => {
  const { title, description, duration, level, participants, category, code } = simulation;

  // Note: The width adjustment is now handled in VRLab.jsx through the useEffect
  // This component just uses the CSS variable set at the document level

  return (
    <Card className="simulation-card">
      <div className="simulation-header">
        <div className="simulation-code-chip">{code}</div>
        <Typography variant="h5" className="simulation-title">
          {title}
        </Typography>
      </div>
      <CardContent className="simulation-content">
        <Typography variant="subtitle1" className="simulation-category">
          {category}
        </Typography>
        
        <Typography variant="body2" className="simulation-instructor">
          Dr. Virtual Reality
        </Typography>
        
        <div className="simulation-progress">
          <Typography variant="body2">Progress</Typography>
          <Typography variant="body2" className="progress-percentage">
            0%
          </Typography>
        </div>
        
        <Typography variant="body2" className="simulation-description">
          {description}
        </Typography>

        <div className="simulation-meta">
          <div className="meta-item">
            <Clock size={14} color={THEME_COLOR} />
            <Typography variant="body2">{duration} min</Typography>
          </div>
          <div className="meta-item">
            <GraduationCap size={14} color={THEME_COLOR} />
            <Typography variant="body2">{level}</Typography>
          </div>
          <div className="meta-item">
            <Users size={14} color={THEME_COLOR} />
            <Typography variant="body2">{participants}</Typography>
          </div>
        </div>
        
        <Button 
          variant="contained" 
          className="launch-button"
          onClick={() => onLaunch(simulation)}
          fullWidth
        >
          LAUNCH SIMULATION
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulationCard;