import React from 'react';
import { useParams } from 'react-router-dom';
import StudentsTable from "../../instructor/StudentsTable";
import InstructorLayout from "../../layout/InstructorLayout";

const Students = () => {
  const { courseId } = useParams();
  
  return (
    <InstructorLayout>
      <div className="content-wrapper">
        <StudentsTable courseId={courseId} />
      </div>
    </InstructorLayout>
  );
};

export default Students;