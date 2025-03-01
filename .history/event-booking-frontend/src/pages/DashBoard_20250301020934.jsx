import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2 className="dashboard-title">Welcome to Dashboard</h2>
        <div className="button-group">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
