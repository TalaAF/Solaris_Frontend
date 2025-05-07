import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import "./AddStudentDialog.css";

const AddStudentDialog = ({ open, onClose, onAddStudents, availableStudents }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter students based on search query
  const filteredStudents = availableStudents.filter(student => 
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddStudent = (studentId) => {
    if (!selectedStudentIds.includes(studentId.toString())) {
      setSelectedStudentIds([...selectedStudentIds, studentId.toString()]);
    }
  };
  
  const handleRemoveStudent = (studentId) => {
    setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId.toString()));
  };
  
  const handleSubmit = () => {
    onAddStudents(selectedStudentIds);
    resetDialog();
  };
  
  const handleClose = () => {
    onClose();
    resetDialog();
  };
  
  const resetDialog = () => {
    setSelectedStudentIds([]);
    setSearchQuery("");
  };
  
  const isStudentSelected = (studentId) => {
    return selectedStudentIds.includes(studentId.toString());
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="add-student-dialog">
        <DialogHeader>
          <DialogTitle>Add Students to Course</DialogTitle>
        </DialogHeader>
        
        <div className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="search"
              placeholder="Search students..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="dialog-body">
          <h4 className="section-title">Available Students</h4>
          <div className="student-list">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <div key={student.id} className="student-row">
                  <div className="student-info">
                    <div className="student-name">{student.fullName}</div>
                    <div className="student-email">{student.email}</div>
                  </div>
                  {!isStudentSelected(student.id) ? (
                    <Button 
                      onClick={() => handleAddStudent(student.id)}
                      className="add-student-button"
                    >
                      Add
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => handleRemoveStudent(student.id)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-students">
                {searchQuery ? "No students match your search" : "No students available"}
              </div>
            )}
          </div>
        </div>
        
        <div className="dialog-footer">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={selectedStudentIds.length === 0}
            className="add-students-button"
          >
            Add {selectedStudentIds.length} Student{selectedStudentIds.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;