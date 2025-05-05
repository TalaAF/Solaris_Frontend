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
 * A container component that handles the tab navigation for course details.
 * Includes Overview, Syllabus, Assessments, and Resources tabs.
 */
function CourseTabs({ courseData }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!courseData) return null;

  return (
    <div className="course-tabs-container">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="course-tabs"
      >
        <TabsList className="tabs-list">
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

        <TabsContent value="resources" className="tab-content">
          <CourseResources courseData={courseData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CourseTabs;
