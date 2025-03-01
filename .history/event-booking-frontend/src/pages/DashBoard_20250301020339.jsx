import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2 className="text-2xl font-semibold mb-6">Welcome to Dashboard</h2>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/events")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            View Events
          </button>
          <button
            onClick={() => navigate("/add-event")}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
