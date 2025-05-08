import React, { useState, useEffect } from "react";
import AssessmentTable from "../../admin/AssessmentTable";
import AdminAssessmentService from "../../../services/AdminAssessmentService";
import { toast } from "react-hot-toast";
import "./AssessmentManagement.css";

const AssessmentManagement = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("quizzes");
  
  // State for quizzes
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [quizPagination, setQuizPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [quizFilters, setQuizFilters] = useState({
    search: "",
    courseId: "",
    status: ""
  });
  
  // State for assignments
  const [assignments, setAssignments] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [assignmentError, setAssignmentError] = useState(null);
  const [assignmentPagination, setAssignmentPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [assignmentFilters, setAssignmentFilters] = useState({
    search: "",
    courseId: "",
    status: ""
  });

  // Fetch quizzes when component mounts or when pagination/filters change
  useEffect(() => {
    if (activeTab === "quizzes") {
      fetchQuizzes();
    }
  }, [activeTab, quizPagination.page, quizPagination.size, quizFilters]);
  
  // Fetch assignments when component mounts or when pagination/filters change
  useEffect(() => {
    if (activeTab === "assignments") {
      fetchAssignments();
    }
  }, [activeTab, assignmentPagination.page, assignmentPagination.size, assignmentFilters]);

  const fetchQuizzes = async () => {
    try {
      setQuizLoading(true);
      setQuizError(null);
      
      // Build query params for pagination and filtering
      const queryParams = new URLSearchParams({
        page: quizPagination.page,
        size: quizPagination.size
      });
      
      if (quizFilters.search) queryParams.append('search', quizFilters.search);
      if (quizFilters.courseId) queryParams.append('courseId', quizFilters.courseId);
      if (quizFilters.status) queryParams.append('published', quizFilters.status);
      
      // TODO: Update endpoint to include query params
      const response = await AdminAssessmentService.getAllQuizzes();
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          setQuizzes(response.data);
          setQuizPagination({
            ...quizPagination,
            totalElements: response.data.length,
            totalPages: Math.ceil(response.data.length / quizPagination.size)
          });
        } else if (response.data.content) {
          setQuizzes(response.data.content);
          setQuizPagination({
            ...quizPagination,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 1
          });
        }
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizError("Failed to load quizzes. Please try again later.");
      toast.error("Failed to load quizzes");
      setQuizzes([]);
    } finally {
      setQuizLoading(false);
    }
  };
  
  const fetchAssignments = async () => {
    try {
      setAssignmentLoading(true);
      setAssignmentError(null);
      
      // Build query params for pagination and filtering
      const queryParams = new URLSearchParams({
        page: assignmentPagination.page,
        size: assignmentPagination.size
      });
      
      if (assignmentFilters.search) queryParams.append('search', assignmentFilters.search);
      if (assignmentFilters.courseId) queryParams.append('courseId', assignmentFilters.courseId);
      if (assignmentFilters.status) queryParams.append('status', assignmentFilters.status);
      
      // TODO: Update endpoint to include query params
      const response = await AdminAssessmentService.getAllAssignments();
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          setAssignments(response.data);
          setAssignmentPagination({
            ...assignmentPagination,
            totalElements: response.data.length,
            totalPages: Math.ceil(response.data.length / assignmentPagination.size)
          });
        } else if (response.data.content) {
          setAssignments(response.data.content);
          setAssignmentPagination({
            ...assignmentPagination,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 1
          });
        }
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignmentError("Failed to load assignments. Please try again later.");
      toast.error("Failed to load assignments");
      setAssignments([]);
    } finally {
      setAssignmentLoading(false);
    }
  };

  // Quizzes handlers
  const handleQuizPageChange = (page) => {
    setQuizPagination({...quizPagination, page});
  };
  
  const handleQuizPageSizeChange = (size) => {
    setQuizPagination({...quizPagination, size, page: 0});
  };
  
  const handleQuizFilterChange = (filters) => {
    setQuizFilters(filters);
    setQuizPagination({...quizPagination, page: 0});
  };
  
  const handleQuizAdd = async (quizData) => {
    try {
      setQuizLoading(true);
      await AdminAssessmentService.createQuiz(quizData);
      toast.success("Quiz created successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz");
      setQuizLoading(false);
    }
  };
  
  const handleQuizUpdate = async (id, quizData) => {
    try {
      setQuizLoading(true);
      await AdminAssessmentService.updateQuiz(id, quizData);
      toast.success("Quiz updated successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Failed to update quiz");
      setQuizLoading(false);
    }
  };
  
  const handleQuizDelete = async (id) => {
    try {
      setQuizLoading(true);
      await AdminAssessmentService.deleteQuiz(id);
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
      setQuizLoading(false);
    }
  };
  
  const handleQuizToggleStatus = async (id, isCurrentlyPublished) => {
    try {
      setQuizLoading(true);
      if (isCurrentlyPublished) {
        await AdminAssessmentService.unpublishQuiz(id);
        toast.success("Quiz unpublished successfully");
      } else {
        await AdminAssessmentService.publishQuiz(id);
        toast.success("Quiz published successfully");
      }
      fetchQuizzes();
    } catch (error) {
      console.error("Error toggling quiz status:", error);
      toast.error(`Failed to ${isCurrentlyPublished ? 'unpublish' : 'publish'} quiz`);
      setQuizLoading(false);
    }
  };
  
  // Assignment handlers
  const handleAssignmentPageChange = (page) => {
    setAssignmentPagination({...assignmentPagination, page});
  };
  
  const handleAssignmentPageSizeChange = (size) => {
    setAssignmentPagination({...assignmentPagination, size, page: 0});
  };
  
  const handleAssignmentFilterChange = (filters) => {
    setAssignmentFilters(filters);
    setAssignmentPagination({...assignmentPagination, page: 0});
  };
  
  const handleAssignmentAdd = async (assignmentData) => {
    try {
      setAssignmentLoading(true);
      await AdminAssessmentService.createAssignment(assignmentData);
      toast.success("Assignment created successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
      setAssignmentLoading(false);
    }
  };
  
  const handleAssignmentUpdate = async (id, assignmentData) => {
    try {
      setAssignmentLoading(true);
      // Note: You may need to implement updateAssignment method in service
      await AdminAssessmentService.updateAssignment(id, assignmentData);
      toast.success("Assignment updated successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Failed to update assignment");
      setAssignmentLoading(false);
    }
  };
  
  const handleAssignmentDelete = async (id) => {
    try {
      setAssignmentLoading(true);
      await AdminAssessmentService.deleteAssignment(id);
      toast.success("Assignment deleted successfully");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
      setAssignmentLoading(false);
    }
  };

  return (
    <div className="admin-assessment-page">
      <div className="admin-assessment-header">
        <h1>Assessment Management</h1>
        <p className="admin-subtitle">
          Manage quizzes and assignments for your courses
        </p>
      </div>

      <div className="tab-container">
        <div className="tab-header">
          <button
            className={`tab-button ${activeTab === "quizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("quizzes")}
          >
            Quizzes
          </button>
          <button
            className={`tab-button ${activeTab === "assignments" ? "active" : ""}`}
            onClick={() => setActiveTab("assignments")}
          >
            Assignments
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "quizzes" && (
            <>
              {quizError && <div className="error-message">{quizError}</div>}
              <AssessmentTable
                assessments={quizzes}
                loading={quizLoading}
                pagination={quizPagination}
                onPageChange={handleQuizPageChange}
                onPageSizeChange={handleQuizPageSizeChange}
                onFilterChange={handleQuizFilterChange}
                onAssessmentAdd={handleQuizAdd}
                onAssessmentUpdate={handleQuizUpdate}
                onAssessmentDelete={handleQuizDelete}
                onAssessmentToggleStatus={handleQuizToggleStatus}
                assessmentType="quiz"
              />
            </>
          )}

          {activeTab === "assignments" && (
            <>
              {assignmentError && <div className="error-message">{assignmentError}</div>}
              <AssessmentTable
                assessments={assignments}
                loading={assignmentLoading}
                pagination={assignmentPagination}
                onPageChange={handleAssignmentPageChange}
                onPageSizeChange={handleAssignmentPageSizeChange}
                onFilterChange={handleAssignmentFilterChange}
                onAssessmentAdd={handleAssignmentAdd}
                onAssessmentUpdate={handleAssignmentUpdate}
                onAssessmentDelete={handleAssignmentDelete}
                assessmentType="assignment"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentManagement;