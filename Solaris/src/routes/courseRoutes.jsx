import { Route, Routes } from "react-router-dom";
import CoursesPage from "../components/pages/CoursesPage";
import CourseView from "../components/courses/CourseView";

export const CourseRoutes = () => {
  return (
    <Routes>
      <Route index element={<CoursesPage />} />
      <Route path=":courseId" element={<CourseView />} />
    </Routes>
  );
};
