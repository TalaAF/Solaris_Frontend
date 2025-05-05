<<<<<<< HEAD
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  CourseOverview,
  CourseSyllabus,
  CourseAssessments,
  CourseResources,
} from "./index";
import "./CourseTabs.css";

/**
 * CourseTabs Component
 *
=======
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { CourseOverview, CourseSyllabus, CourseAssessments, CourseResources } from './index';
import './CourseTabs.css';

/**
 * CourseTabs Component
 * 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
 * A container component that handles the tab navigation for course details.
 * Includes Overview, Syllabus, Assessments, and Resources tabs.
 */
function CourseTabs({ courseData }) {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("overview");
=======
  const [activeTab, setActiveTab] = useState('overview');
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2

  if (!courseData) return null;

  return (
    <div className="course-tabs-container">
<<<<<<< HEAD
      <Tabs
        defaultValue="overview"
=======
      <Tabs 
        defaultValue="overview" 
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        value={activeTab}
        onValueChange={setActiveTab}
        className="course-tabs"
      >
        <TabsList className="tabs-list">
<<<<<<< HEAD
          <TabsTrigger value="overview" className="tab-trigger">
            Overview
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="tab-trigger">
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="assessments" className="tab-trigger">
            Assessments
          </TabsTrigger>
          <TabsTrigger value="resources" className="tab-trigger">
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="tab-content">
          <CourseOverview courseData={courseData} />
        </TabsContent>

        <TabsContent value="syllabus" className="tab-content">
          <CourseSyllabus courseData={courseData} />
        </TabsContent>

        <TabsContent value="assessments" className="tab-content">
          <CourseAssessments courseData={courseData} />
        </TabsContent>

=======
          <TabsTrigger value="overview" className="tab-trigger">Overview</TabsTrigger>
          <TabsTrigger value="syllabus" className="tab-trigger">Syllabus</TabsTrigger>
          <TabsTrigger value="assessments" className="tab-trigger">Assessments</TabsTrigger>
          <TabsTrigger value="resources" className="tab-trigger">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="tab-content">
          <CourseOverview courseData={courseData} />
        </TabsContent>
        
        <TabsContent value="syllabus" className="tab-content">
          <CourseSyllabus courseData={courseData} />
        </TabsContent>
        
        <TabsContent value="assessments" className="tab-content">
          <CourseAssessments courseData={courseData} />
        </TabsContent>
        
>>>>>>> 9e8d092adf75508b4d3d715542f0b6cf5979a6a2
        <TabsContent value="resources" className="tab-content">
          <CourseResources courseData={courseData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CourseTabs;
