import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>
      <p>Choose an action:</p>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/events")}>View Events</button>
        <button onClick={() => navigate("/add-event")}>Add Event</button>
      </div>
    </div>
  );
};

export default DashboardPage;
