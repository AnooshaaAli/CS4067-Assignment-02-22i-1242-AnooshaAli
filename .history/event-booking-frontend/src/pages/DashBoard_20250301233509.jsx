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
            events: 12,
            bookings: 48,
            users: 156
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
          name: "Book Events", 
          path: "/events", 
          color: "#3498db", 
          hoverColor: "#2980b9",
          description: "Browse and manage all events" 
        },
        { 
          name: "Add Event", 
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
    },
    {
      title: "User Management",
      icon: "👥",
      options: [
        { 
          name: "Users", 
          path: "/users", 
          color: "#e67e22", 
          hoverColor: "#d35400",
          description: "View and manage user accounts" 
        },
        { 
          name: "Settings", 
          path: "/settings", 
          color: "#7f8c8d", 
          hoverColor: "#6c7a7d",
          description: "System configuration" 
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
              <div className="stat-card">
                <div className="stat-icon users-icon">👥</div>
                <div className="stat-details">
                  <h3 className="stat-count">{stats.users}</h3>
                  <p className="stat-label">Users</p>
                </div>
              </div>
            </div>
          )}

          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={() => navigate("/add-event")} 
                className="quick-action-button create-event-btn"
              >
                <span className="button-icon">➕</span>
                Create Event
              </button>
              <button 
                onClick={() => navigate("/bookings")} 
                className="quick-action-button manage-bookings-btn"
              >
                <span className="button-icon">🔍</span>
                Manage Bookings
              </button>
              <button 
                className="quick-action-button reports-btn"
                onClick={() => navigate("/booking-reports")}
              >
                <span className="button-icon">📊</span>
                View Reports
              </button>
            </div>
          </div>

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

          <div className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon booking-activity">🎟️</div>
                <div className="activity-details">
                  <p className="activity-text">New booking received for <strong>Summer Concert</strong></p>
                  <p className="activity-time">5 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon event-activity">📅</div>
                <div className="activity-details">
                  <p className="activity-text"><strong>Business Conference</strong> was updated</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon user-activity">👤</div>
                <div className="activity-details">
                  <p className="activity-text">New user registered: <strong>john.doe@example.com</strong></p>
                  <p className="activity-time">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;