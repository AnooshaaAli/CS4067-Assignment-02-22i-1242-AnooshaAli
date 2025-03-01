import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";

function AppRouter() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
