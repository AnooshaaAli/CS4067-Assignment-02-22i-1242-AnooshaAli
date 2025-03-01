import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    events: 0,
    bookings: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard statistics
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch these from your API
        // const response = await fetch("http://127.0.0.1:8000/dashboard/stats");
        // const data = await response.json();
        
        // Using mock data for demonstration
        setTimeout(() => {
          setStats({
            events: 21,
            bookings: 12,
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: "Events",
      icon: "📅",
      options: [
        { 
          name: "Book an Event", 
          path: "/events", 
          color: "#3498db", 
          hoverColor: "#2980b9",
          description: "Browse and manage all events" 
        },
        { 
          name: "Add an Event", 
          path: "/add-event", 
          color: "#2ecc71", 
          hoverColor: "#27ae60",
          description: "Create a new event listing" 
        }
      ]
    },
    {
      title: "Bookings",
      icon: "🎟️",
      options: [
        { 
          name: "View Bookings", 
          path: "/bookings", 
          color: "#9b59b6", 
          hoverColor: "#8e44ad",
          description: "Manage reservations and tickets" 
        }
      ]
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1 className="welcome-text">Welcome to the Admin Dashboard</h1>
            <p className="welcome-subtext">Manage your events and bookings from one place</p>
          </header>

          {loading ? (
            <div className="stats-loading">
              <div className="loading-spinner"></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon events-icon">📅</div>
                <div className="stat-details">
                  <h3 className="stat-count">{stats.events}</h3>
                  <p className="stat-label">Events</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bookings-icon">🎟️</div>
                <div className="stat-details">
                  <h3 className="stat-count">{stats.bookings}</h3>
                  <p className="stat-label">Bookings</p>
                </div>
              </div>
            </div>
          )}
          <div className="menu-sections">
            {menuItems.map((section, index) => (
              <div key={index} className="menu-section">
                <h2 className="section-title">
                  <span className="section-icon">{section.icon}</span>
                  {section.title}
                </h2>
                <div className="menu-cards">
                  {section.options.map((option, idx) => (
                    <div 
                      key={idx} 
                      className="menu-card"
                      onClick={() => navigate(option.path)}
                      style={{
                        backgroundColor: option.color,
                        "--hover-color": option.hoverColor
                      }}
                    >
                      <h3 className="menu-card-title">{option.name}</h3>
                      <p className="menu-card-description">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;