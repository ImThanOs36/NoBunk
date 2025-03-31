import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import FacultyLogin from "./pages/FacultyLogin";
import CreateClass from "./pages/CreateClass";
import ClassRecords from "./pages/ClassRecords";
import ClassAttendance from "./pages/ClassAttendance";
import StudentProfile from "./pages/StudentProfile";
import SubjectManagement from "./pages/SubjectManagement";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/faculty/login" element={<FacultyLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />

                {/* Other Routes */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/faculty" element={<FacultyDashboard />} />
                <Route path="/create-class" element={<CreateClass />} />
                <Route path="/class-records" element={<ClassRecords />} />
                <Route path="/class-attendance/:id" element={<ClassAttendance />} />
                <Route path="/student/:enrNumber" element={<StudentProfile />} />
                <Route path="/admin/subjects" element={<SubjectManagement />} />
            </Routes>
        </Router>
    );
}

export default App;