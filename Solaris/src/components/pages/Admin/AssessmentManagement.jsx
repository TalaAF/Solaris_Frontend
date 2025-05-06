import React, { useState } from "react";
import Layout from "../../layout/Layout";
import AssessmentTable from "../../admin/AssessmentTable";
import { assessments as initialAssessments } from "../../../mocks/mockDataAdmin";
import "./AssessmentManagement.css";

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState(initialAssessments || []);

  const handleAssessmentAdd = (assessmentData) => {
    console.log("Adding assessment:", assessmentData);
    // In a real app, you would make an API call here
    const newAssessment = {
      ...assessmentData,
      id: Math.max(0, ...assessments.map((a) => a.id)) + 1,
    };
    setAssessments([...assessments, newAssessment]);
    alert("Assessment created successfully");
  };

  const handleAssessmentUpdate = (assessmentData) => {
    console.log("Updating assessment:", assessmentData);
    // In a real app, you would make an API call here
    const updatedAssessments = assessments.map(item => 
      item.id === assessmentData.id ? assessmentData : item
    );
    setAssessments(updatedAssessments);
    alert("Assessment updated successfully");
  };

  const handleAssessmentToggleStatus = (assessmentId, newStatus) => {
    console.log(`${newStatus ? "Publishing" : "Unpublishing"} assessment with ID:`, assessmentId);
    // In a real app, you would make an API call here
    const updatedAssessments = assessments.map(item => 
      item.id === assessmentId ? { ...item, isPublished: newStatus } : item
    );
    setAssessments(updatedAssessments);
    alert(`Assessment ${newStatus ? "published" : "unpublished"} successfully`);
  };

  const handleAssessmentDelete = (assessmentId) => {
    console.log("Deleting assessment with ID:", assessmentId);
    // In a real app, you would make an API call here
    const updatedAssessments = assessments.filter(item => item.id !== assessmentId);
    setAssessments(updatedAssessments);
    alert("Assessment deleted successfully");
  };

  return (
    <>
      <div className="admin-assessment-page">
        <div className="admin-assessment-header">
          <h1 className="admin-title">Assessment Management</h1>
          <p className="admin-subtitle">Create and manage course assessments</p>
        </div>

        <AssessmentTable 
          assessments={assessments} 
          onAssessmentAdd={handleAssessmentAdd} 
          onAssessmentUpdate={handleAssessmentUpdate}
          onAssessmentToggleStatus={handleAssessmentToggleStatus}
          onAssessmentDelete={handleAssessmentDelete}
        />
      </div>
    </>
  );
};

export default AssessmentManagement;