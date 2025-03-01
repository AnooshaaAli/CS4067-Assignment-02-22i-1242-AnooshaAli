import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2 className="dashboard-title">Welcome to Dashboard</h2>
        <div className="button-group">
          {/* Existing Buttons */}
          <button
            onClick={() => navigate("/events")}
            className="dashboard-button view-events"
          >
            View Events
          </button>
          <button
            onClick={() => navigate("/add-event")}
            className="dashboard-button add-event"
          >
            Add Event
          </button>

          {/* New Booking Buttons */}
          <button
            onClick={() => navigate("/bookings")}
            className="dashboard-button view-bookings"
          >
            View Bookings
          </button>
          <button
            onClick={() => navigate("/add-booking")}
            className="dashboard-button add-booking"
          >
            Make a Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
