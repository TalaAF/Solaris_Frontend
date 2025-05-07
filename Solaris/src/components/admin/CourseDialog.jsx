import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import "./CourseDialog.css";

const CourseDialog = ({ isOpen, onClose, onSubmit, course, title }) => {
  // Initial form state aligned with backend model
  const initialFormData = {
    title: "",
    code: "",
    description: "",
    department: { id: null },
    instructor: { id: null },
    maxCapacity: 50,
    published: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    credits: 3,
    semester: "Spring 2025",
    academicLevel: "Undergraduate",
    tags: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments and instructors when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartmentsAndInstructors();
    }
  }, [isOpen]);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      if (course) {
        // Map backend course model to form data
        setFormData({
          id: course.id,
          title: course.title || "",
          code: course.code || "",
          description: course.description || "",
          department: {
            id: course.department?.id || 
                (typeof course.departmentId === 'number' ? course.departmentId : null)
          },
          instructor: {
            id: course.instructor?.id || 
                (typeof course.instructorId === 'number' ? course.instructorId : null)
          },
          maxCapacity: course.maxCapacity || 50,
          published: course.published !== undefined ? course.published : true,
          startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : "",
          endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : "",
          credits: course.credits || 3,
          semester: course.semester || "Spring 2025",
          academicLevel: course.academicLevel || "Undergraduate",
          tags: course.tags || []
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, course]);

  const fetchDepartmentsAndInstructors = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch these from your API
      // For now we're using mock data
      setDepartments([
        { id: 1, name: "Administration" },
        { id: 2, name: "Mathematics" },
        { id: 3, name: "Physics" },
        { id: 5, name: "Computer Science" }
      ]);
      
      setInstructors([
        { id: 1, name: "John Smith", email: "john.smith@example.com" },
        { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
        { id: 3, name: "Robert Brown", email: "robert.brown@example.com" }
      ]);
    } catch (error) {
      console.error("Failed to fetch departments or instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleDepartmentChange = (e) => {
    const departmentId = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      department: { id: departmentId }
    });
  };

  const handleInstructorChange = (e) => {
    const instructorId = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      instructor: { id: instructorId }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for API submission
    const submissionData = {
      ...formData,
      // Convert any special fields as needed
    };
    
    onSubmit(submissionData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Course Code</label>
            <input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. CS101"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-textarea"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="instructor">Instructor</label>
            <select
              id="instructor"
              name="instructor"
              value={formData.instructor.id || ""}
              onChange={handleInstructorChange}
              className="form-select"
              disabled={loading}
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department.id || ""}
              onChange={handleDepartmentChange}
              className="form-select"
              required
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="maxCapacity">Maximum Capacity</label>
          <input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            min="1"
            value={formData.maxCapacity}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleCheckboxChange}
            className="form-checkbox"
          />
          <label htmlFor="published">Published</label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {course ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CourseDialog;