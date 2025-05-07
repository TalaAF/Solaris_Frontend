import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { courses as initialCourses } from "../../../mocks/mockDataAdmin";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import "./CourseSettings.css";

const CourseSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form states
  const [settings, setSettings] = useState({
    isPublic: true,
    allowLateSubmissions: true,
    allowStudentsToSeeGrades: true,
    notifyOnNewSubmissions: true,
    gradeScale: "standard",
    passingThreshold: 70,
    autoEnroll: false,
  });
  
  useEffect(() => {
    // Simulate API call to fetch course
    const courseId = parseInt(id);
    const foundCourse = initialCourses.find(c => c.id === courseId);
    
    setTimeout(() => {
      setCourse(foundCourse || null);
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleToggleSetting = (settingName) => {
    setSettings({
      ...settings,
      [settingName]: !settings[settingName]
    });
    alert(`Setting updated successfully`);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setSettings({
      ...settings,
      [name]: value
    });
    alert(`${name} setting updated successfully`);
  };
  
  const handleDeleteCourse = () => {
    // In a real app, this would make an API call to delete the course
    alert("Course deleted successfully");
    setIsDeleteDialogOpen(false);
    navigate("/admin/courses");
  };
  
  if (isLoading) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <div className="course-not-found">
          <button className="back-button" onClick={() => navigate('/admin/courses')}>
            <ChevronLeft className="back-icon" />
            Back to Courses
          </button>
          <div className="not-found-card">
            <h2>Course Not Found</h2>
            <p>The course you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/admin/courses')}>Return to Course List</button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="course-settings-container">
        <div className="course-settings-header">
          <div className="header-left">
            <button 
              className="back-button" 
              onClick={() => navigate(`/admin/courses/${id}`)}
            >
              <ChevronLeft size={18} />
              <span>Back to Course Details</span>
            </button>
            <h1 className="course-title">
              Settings - {course.title}
            </h1>
            <span className={`status-badge ${course.isActive ? "active" : "inactive"}`}>
              {course.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        
        <div className="settings-tabs">
          <div className="tabs-list">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General Settings
            </button>
            <button 
              className={`tab-button ${activeTab === 'grading' ? 'active' : ''}`}
              onClick={() => setActiveTab('grading')}
            >
              Grading
            </button>
            <button 
              className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="settings-card">
              <div className="card-header">
                <h2 className="card-title">General Settings</h2>
                <p className="card-description">
                  Configure general course settings
                </p>
              </div>
              <div className="card-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Public Course</h3>
                    <p className="setting-description">
                      Allow all authenticated users to view this course
                    </p>
                  </div>
                  <div className="setting-control">
                    <Switch 
                      checked={settings.isPublic} 
                      onCheckedChange={() => handleToggleSetting('isPublic')}
                    />
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Auto Enrollment</h3>
                    <p className="setting-description">
                      Allow students to enroll themselves in this course
                    </p>
                  </div>
                  <div className="setting-control">
                    <Switch 
                      checked={settings.autoEnroll} 
                      onCheckedChange={() => handleToggleSetting('autoEnroll')}
                    />
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Notification Settings</h3>
                    <p className="setting-description">
                      Receive notifications for new submissions
                    </p>
                  </div>
                  <div className="setting-control">
                    <Switch 
                      checked={settings.notifyOnNewSubmissions} 
                      onCheckedChange={() => handleToggleSetting('notifyOnNewSubmissions')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'grading' && (
            <div className="settings-card">
              <div className="card-header">
                <h2 className="card-title">Grading Settings</h2>
                <p className="card-description">
                  Configure how grades are calculated and displayed
                </p>
              </div>
              <div className="card-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Student Grade Visibility</h3>
                    <p className="setting-description">
                      Allow students to see their grades
                    </p>
                  </div>
                  <div className="setting-control">
                    <Switch 
                      checked={settings.allowStudentsToSeeGrades} 
                      onCheckedChange={() => handleToggleSetting('allowStudentsToSeeGrades')}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="gradeScale">Grade Scale</Label>
                  <Select
                    value={settings.gradeScale}
                    onValueChange={(value) => handleSelectChange('gradeScale', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (A, B, C, D, F)</SelectItem>
                      <SelectItem value="percentage">Percentage Only</SelectItem>
                      <SelectItem value="passFail">Pass/Fail</SelectItem>
                      <SelectItem value="custom">Custom Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="passingThreshold">Passing Threshold (%)</Label>
                  <Input
                    id="passingThreshold"
                    name="passingThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.passingThreshold}
                    onChange={handleInputChange}
                    onBlur={() => alert("Passing threshold updated")}
                  />
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-title">Late Submissions</h3>
                    <p className="setting-description">
                      Allow students to submit assignments after the due date
                    </p>
                  </div>
                  <div className="setting-control">
                    <Switch 
                      checked={settings.allowLateSubmissions} 
                      onCheckedChange={() => handleToggleSetting('allowLateSubmissions')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="settings-card">
              <div className="card-header danger">
                <div className="header-with-icon">
                  <AlertTriangle className="header-icon" />
                  <h2 className="card-title danger">Danger Zone</h2>
                </div>
                <p className="card-description">
                  Be careful with these actions as they cannot be undone
                </p>
              </div>
              <div className="card-content">
                <div className="danger-item">
                  <div className="danger-item-info">
                    <h3 className="setting-title">Delete Course</h3>
                    <p className="setting-description">
                      Permanently delete this course and all associated data
                    </p>
                  </div>
                  <Button 
                    className="danger-button"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete Course
                  </Button>
                </div>
                
                <div className="action-item">
                  <div className="action-item-info">
                    <h3 className="setting-title">Archive Course</h3>
                    <p className="setting-description">
                      Archive this course to hide it from active courses
                    </p>
                  </div>
                  <Button 
                    className="outline-button"
                    onClick={() => alert("Course archived")}
                  >
                    Archive Course
                  </Button>
                </div>
                
                <div className="action-item">
                  <div className="action-item-info">
                    <h3 className="setting-title">Reset Course Data</h3>
                    <p className="setting-description">
                      Reset all student progress and grades
                    </p>
                  </div>
                  <Button 
                    className="outline-button"
                    onClick={() => alert("Course data has been reset")}
                  >
                    Reset Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isDeleteDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDeleteDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="header-with-icon danger">
                <AlertTriangle className="header-icon" />
                <h3 className="dialog-title danger">Confirm Deletion</h3>
              </div>
            </div>
            <div className="dialog-body">
              <p>
                Are you sure you want to delete <strong>{course.title}</strong>?
                This action cannot be undone and will remove all associated data.
              </p>
            </div>
            <div className="dialog-footer">
              <Button 
                className="outline-button" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="danger-button" 
                onClick={handleDeleteCourse}
              >
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseSettings;