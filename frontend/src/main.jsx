import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLogin from "./pages/StudentLogin";
import CreateClass from "./pages/CreateClass";
import ClassRecords from "./pages/ClassRecords";
import ClassAttendances from "./pages/ClassAttendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/facultylogin",
    element: <FacultyLogin />,
  },
  {
    path: "/studentlogin",
    element: <StudentLogin />,
  },
  {
    path: "/faculty",
    element: <FacultyDashboard />,
  },
  {
    path: "/createclass",
    element: <CreateClass />,
  },
  {
    path: "/classrecords",
    element: <ClassRecords />,
  },
  {
    path: "/classattendance/:classId",
    element: <ClassAttendances />,
  },
  {
    path: "/summary/:enrNumber",
    element: <StudentDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);