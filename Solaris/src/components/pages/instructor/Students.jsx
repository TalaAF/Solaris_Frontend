import React from 'react';

import StudentsTable from "../../instructor/StudentsTable";
import InstructorLayout from "../../layout/InstructorLayout";

const Students = () => {
  return (
    <InstructorLayout>
      <div className="content-wrapper">
        <StudentsTable />
      </div>
    </InstructorLayout>
  );
};

export default Students;