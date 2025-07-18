import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Award, Check, ChevronLeft, AlertCircle } from "lucide-react";
import CertificateService from "../../../services/CertificateService";
import AdminCourseService from "../../../services/AdminCourseService";
import "./CourseGraduationPage.css";

const CourseGraduationPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state?.courseData || {};
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [students, setStudents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch students enrolled in this course
        const studentsResponse = await AdminCourseService.getCourseStudents(courseId);
        const studentsList = Array.isArray(studentsResponse.data) 
          ? studentsResponse.data 
          : (studentsResponse.data?.content || []);
        
        // Fetch available certificate templates
        const templatesResponse = await CertificateService.getAllCertificateTemplates();
        const templatesList = templatesResponse.data || [];
        
        setStudents(studentsList);
        setTemplates(templatesList);
        
        if (templatesList.length > 0) {
          setSelectedTemplate(templatesList[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading graduation data:", error);
        toast.error("Failed to load students or certificate templates");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      // Select all students who have completed the course (progress >= 100)
      const completedStudentIds = students
        .filter(student => (student.progress || 0) >= 100)
        .map(student => student.id);
      setSelectedStudents(completedStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };
  
  const handleToggleStudent = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };
  
  const handleGenerateCertificates = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    
    try {
      setProcessing(true);
      const response = await CertificateService.generateBatchCertificates(
        courseId, 
        selectedStudents,
        selectedTemplate
      );
      
      setProcessing(false);
      setGenerationSuccess(true);
      setGeneratedCount(selectedStudents.length);
      toast.success(`Generated ${selectedStudents.length} certificates successfully`);
    } catch (error) {
      console.error("Error generating certificates:", error);
      toast.error("Failed to generate certificates");
      setProcessing(false);
    }
  };
  
  const handleViewCertificates = () => {
    navigate(`/admin/certificates?courseId=${courseId}`);
  };
  
  const handleReturnToCourse = () => {
    navigate(`/admin/courses/${courseId}`);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course graduation data...</p>
      </div>
    );
  }

  // Success view after generating certificates
  if (generationSuccess) {
    return (
      <div className="certificate-success-container">
        <div className="success-icon">
          <Check size={40} color="#22c55e" />
        </div>
        <h1 className="success-title">Certificates Generated Successfully</h1>
        <p className="success-message">
          {generatedCount} certificate{generatedCount !== 1 ? 's' : ''} have been generated and are ready to be viewed or shared.
        </p>
        <div className="success-actions">
          <button className="secondary-button" onClick={handleReturnToCourse}>
            Return to Course
          </button>
          <button className="primary-button" onClick={handleViewCertificates}>
            View Certificates
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="course-graduation-page">
      <div className="graduation-header">
        <button className="back-button" onClick={handleReturnToCourse}>
          <ChevronLeft size={16} />
          Back to Course
        </button>
        <h1>Generate Certificates</h1>
        <p className="course-title">{courseData.title || `Course #${courseId}`}</p>
      </div>
      
      <div className="graduation-settings">
        <div className="template-selector">
          <label>Certificate Template</label>
          <select 
            value={selectedTemplate || ''} 
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="template-select"
          >
            {templates.length === 0 && (
              <option value="" disabled>No templates available</option>
            )}
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="students-container">
        <div className="students-header">
          <div className="students-count">
            {students.length} Students Enrolled
          </div>
          <div className="select-all-container">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={handleToggleSelectAll}
            />
            <label htmlFor="select-all">Select All Eligible Students</label>
          </div>
        </div>
        
        {students.length === 0 ? (
          <div className="no-students-message">
            No students are enrolled in this course.
          </div>
        ) : (
          <div className="students-list">
            {students.map(student => {
              const isCompleted = (student.progress || 0) >= 100;
              return (
                <div key={student.id} className={`student-item ${!isCompleted ? 'not-eligible' : ''}`}>
                  <div className="student-select">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleToggleStudent(student.id)}
                      disabled={!isCompleted}
                    />
                  </div>
                  <div className="student-info">
                    <div className="student-name">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="student-email">
                      {student.email}
                    </div>
                  </div>
                  <div className={`student-status ${isCompleted ? 'completed' : ''}`}>
                    {isCompleted ? 'Completed' : `${student.progress || 0}% Complete`}
                    {!isCompleted && (
                      <div className="ineligible-tooltip">
                        <AlertCircle size={14} />
                        <span className="tooltip-text">Student must complete the course to receive a certificate</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="graduation-actions">
        <button 
          className="cancel-button" 
          onClick={handleReturnToCourse}
          disabled={processing}
        >
          Cancel
        </button>
        <button 
          className="generate-button" 
          onClick={handleGenerateCertificates}
          disabled={selectedStudents.length === 0 || processing}
        >
          {processing ? 'Generating...' : (
            <>
              <Award size={16} />
              Generate Certificates ({selectedStudents.length})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseGraduationPage;