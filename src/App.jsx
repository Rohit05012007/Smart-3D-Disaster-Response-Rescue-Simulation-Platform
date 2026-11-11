
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import {
  Activity,
  AlertTriangle,
  Map,
  Users,
  Radio,
  Shield,
  Zap,
  Navigation,
  Menu,
  Bell,
  Search,
  Flame,
  Waves,
  Building2,
  Crosshair,
  ShieldCheck,
  Truck,
} from "lucide-react";


import "./App.css";
const API_URL = "http://127.0.0.1:8000";
const checkBackend = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/health");
    const data = await response.json();

    setBackendStatus(data.status);
  } catch (error) {
    console.error("Backend Connection Failed:", error);
    setBackendStatus("offline");
  }
};
function FloodZone() {
  const waterRef = useRef();
  const rippleRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (waterRef.current) {
      waterRef.current.material.opacity =
        0.18 + Math.sin(t * 2) * 0.06;
    }

    if (rippleRef.current) {
      const scale = 0.85 + ((Math.sin(t * 1.5) + 1) / 2) * 0.3;

      rippleRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[4.5, 0.03, 4.5]}>

      {/* BLUE WATER SURFACE */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.3, 64]} />
        <meshBasicMaterial
          color="#008cff"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* GLOWING FLOOD BOUNDARY */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 64]} />
        <meshBasicMaterial
          color="#00cfff"
          transparent
          opacity={0.9}
          side={2}
        />
      </mesh>

      {/* ANIMATED WATER RIPPLE */}
      <mesh
        ref={rippleRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.75, 0.85, 64]} />
        <meshBasicMaterial
          color="#42eaff"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* FLOOD CENTER */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshBasicMaterial color="#00eaff" />
      </mesh>

    </group>
  );
}
function RescueTeams() {
  const teams = [
    [-4, 0.15, 3],
    [3, 0.15, -4],
    [5, 0.15, 2]
  ];

  return (
    <group>
      {teams.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshBasicMaterial color="#00ff9d" />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.32, 32]} />
            <meshBasicMaterial color="#00ff9d" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function CityScene() {
  const buildings = [
    [-4, 0.8, -3, 1.2, 1.6, 1.2],
    [-2, 1.2, -3, 1.2, 2.4, 1.2],
    [1, 0.7, -3, 1.3, 1.4, 1.3],
    [4, 1.4, -3, 1.3, 2.8, 1.3],
    [-4, 1, 1, 1.2, 2, 1.2],
    [-1, 0.7, 1, 1.3, 1.4, 1.3],
    [2, 1.3, 1, 1.2, 2.6, 1.2],
    [4, 0.8, 2, 1.3, 1.6, 1.3],
    [-3, 0.6, 4, 1.2, 1.2, 1.2],
    [1, 0.9, 4, 1.3, 1.8, 1.3],
  ];

  return (
    <>
      <FloodZone />
      <RescueTeams />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#101d2a" />
      </mesh>

      <gridHelper args={[20, 30, "#16445a", "#193343"]} />
      {/* FIRE DISASTER ZONE */}
<mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, 0.015, 0]}
>
  <circleGeometry args={[1.5, 48]} />
  <meshBasicMaterial
    color="#ff2525"
    transparent
    opacity={0.18}
  />
</mesh>

<mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, 0.025, 0]}
>
  <ringGeometry args={[1.35, 1.5, 48]} />
  <meshBasicMaterial color="#ff3939" />
</mesh>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]}>
          <boxGeometry args={[b[3], b[4], b[5]]} />
          <meshStandardMaterial
            color={i === 3 ? "#713b32" : "#263e50"}
            emissive={i === 3 ? "#b83d20" : "#102c40"}
            emissiveIntensity={0.5}
          />
        </mesh>
        
      ))}

      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshBasicMaterial color="#ff4d4d" />
      </mesh>

      <mesh position={[3, 0.02, 2]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      <mesh position={[-3, 0.02, -1]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      <OrbitControls
        enablePan={true}
        minDistance={7}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}
function App() {
  const [rescueTeams, setRescueTeams] = useState([
  {
    id: "TEAM-01",
    name: "Alpha Rescue Team",
    zone: "North Zone",
    members: 6,
    incident: "INC-001",
    status: "ON MISSION",
  },
  {
    id: "TEAM-02",
    name: "Bravo Rescue Team",
    zone: "East Zone",
    members: 5,
    incident: "None",
    status: "AVAILABLE",
  },
  {
    id: "TEAM-03",
    name: "Charlie Rescue Team",
    zone: "Central Zone",
    members: 8,
    incident: "None",
    status: "AVAILABLE",
  },
]);
  const [incidents, setIncidents] = useState([]);
const [loadingIncidents, setLoadingIncidents] = useState(true);
const [incidentError, setIncidentError] = useState("");

const fetchIncidents = async () => {
  try {
    setLoadingIncidents(true);
    setIncidentError("");

    const response = await fetch(`${API_URL}/incidents`);

    if (!response.ok) {
      throw new Error("Failed to fetch incidents");
    }

    const data = await response.json();

     

    const mappedIncidents = data.map((incident) => ({
      ...incident,
      name: incident.title,
      level: incident.severity,
      icon: incident.title.toLowerCase().includes("fire")
        ? Flame
        : incident.title.toLowerCase().includes("flood")
        ? Waves
        : Building2,
    }));

    setIncidents(mappedIncidents);
    setSelectedIncident(mappedIncidents[0] || null);
  } catch (error) {
    console.error("Incident Fetch Error:", error);
    setIncidentError("Unable to load incidents from backend.");
  } finally {
    setLoadingIncidents(false);
  }
};

useEffect(() => {
  fetchIncidents();
}, []);

const updateTeamStatus = (id, status) => {
  setRescueTeams((teams) =>
    teams.map((team) =>
      team.id === id
        ? {
            ...team,
            status,
            incident: status === "AVAILABLE" ? "None" : "INC-001",
          }
        : team
    )
  );
};
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [alerts, setAlerts] = useState([]);
const [loadingAlerts, setLoadingAlerts] = useState(true);
const [alertError, setAlertError] = useState("");
const [showNotifications, setShowNotifications] = useState(false);
const [selectedIncident, setSelectedIncident] = useState(null);
  

  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setBackendStatus(data.status);
    } catch (error) {
      console.error("Backend Connection Failed:", error);
      setBackendStatus("offline");
    }
  };
const fetchAlerts = async () => {
  try {
    setLoadingAlerts(true);
    setAlertError("");

    const response = await fetch(`${API_URL}/alerts`);

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    const data = await response.json();
    setAlerts(data);

  } catch (error) {
    console.error("Alert Fetch Error:", error);
    setAlertError("Unable to load alerts from backend.");
  } finally {
    setLoadingAlerts(false);
  }
};
const updateAlertStatus = async (alertId, status) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update alert");
    }

    const updatedAlert = await response.json();

    setAlerts((previousAlerts) =>
      previousAlerts.map((item) =>
        item.id === alertId ? updatedAlert : item
      )
    );

  } catch (error) {
    console.error("Alert Update Error:", error);
    setAlertError("Unable to update alert status.");
  }
};
 useEffect(() => {
  checkBackend();
  fetchAlerts();
}, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Shield size={25} />
          </div>
          <div>
            <h2>DISASTER<span> RESPONSE</span></h2>
            <small>INTELLIGENCE PLATFORM</small>
          </div>
        </div>

        <div className="nav-label">COMMAND CENTER</div>

        {[
          ["Overview", Activity],
          ["Live Simulation", Map],
          ["Rescue Teams", Users],
          ["Emergency Alerts", Bell],
        ].map(([name, Icon]) => (
          <button
            key={name}
            className={`nav-item ${activeTab === name ? "active" : ""}`}
            onClick={() => setActiveTab(name)}
          >
            <Icon size={19} />
            {name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            SYSTEM OPERATIONAL
          </div>
          <small>DISASTER MANAGEMENT v1.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">COMMAND / {activeTab.toUpperCase()}</div>
            <h1>{activeTab}</h1>
          </div>

          <div className="top-actions">
            <div className="live-indicator">
              <span
  className="status-dot"
  style={{
    backgroundColor: backendStatus === "healthy" ? "#16a34a" : "#dc2626"
  }}
/>
{backendStatus === "healthy" ? "BACKEND CONNECTED" : "BACKEND OFFLINE"}
            </div>
            <button
              className="icon-button"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Toggle notifications"
            >
              <Bell size={20} />
              {showNotifications && <span className="notification-dot" />}
            </button>
            <div className="profile">DR</div>
          </div>
        </header>
        {activeTab === "Overview" ? (
  <section className="overview-page">
    <div className="panel-header">
      <div>
        <h3><Activity size={20} /> DISASTER OVERVIEW</h3>
        <small>REAL-TIME RESPONSE SUMMARY</small>
      </div>
    </div>

    <div className="overview-stats">
  <div className="overview-card">
    <div className="overview-card-icon cyan">
      <div className="overview-card-icon cyan">
  <AlertTriangle size={22} />
</div>
    </div>
    <span>Total Incidents</span>
    <h2>{incidents.length}</h2>
    <small>All reported incidents</small>
  </div>

  <div className="overview-card">
    <div className="overview-card-icon red">
      <div className="overview-card-icon red">
  <ShieldCheck size={22} />
</div>
    </div>
    <span>Active Emergencies</span>
    <h2>
      {incidents.filter((incident) => {
  const relatedAlert = alerts.find(
    (alert) => alert.incident_id === incident.id
  );

  return !relatedAlert || relatedAlert.status !== "RESOLVED";
}).length}
    </h2>
    <small>Awaiting resolution</small>
  </div>

  <div className="overview-card">
    <div className="overview-card-icon blue">
      <div className="overview-card-icon blue">
  <Users size={22} />
</div>
    </div>
    <span>Rescue Teams</span>
    <h2>{rescueTeams.length}</h2>
    <small>Registered response teams</small>
  </div>

  <div className="overview-card">
    <div className="overview-card-icon purple">
      <div className="overview-card-icon purple">
  <Truck size={22} />
</div>
    </div>
    <span>Teams on Mission</span>
    <h2>
      {rescueTeams.filter(
        (team) => team.status === "ON MISSION"
      ).length}
    </h2>
    <small>Currently deployed</small>
  </div>
</div>


    
    
    <div className="overview-bottom">
      {/* Recent Incidents */}
      <div className="overview-panel">
        <div className="overview-panel-header">
          <h3>Recent Incidents</h3>
          <span>{incidents.length} Total</span>
        </div>

        {incidents.slice(0, 5).map((incident) => (
  <div
  className="recent-incident"
  key={incident.id}
  onClick={() => setSelectedIncident(incident)}
  style={{ cursor: "pointer" }}
>
    <div className="recent-incident-info">
      <div className="recent-incident-icon">
        {incident.name.toLowerCase().includes("fire") ? (
          <Flame size={20} />
        ) : incident.name.toLowerCase().includes("flood") ? (
          <Waves size={20} />
        ) : (
          <AlertTriangle size={20} />
        )}
      </div>

      <div>
        <strong>{incident.name}</strong>
        <p>{incident.location}</p>
      </div>
    </div>

    <span className={`incident-priority ${incident.level.toLowerCase()}`}>
      {incident.level}
    </span>
  </div>
))}
      </div>

      {/* Rescue Team Status */}
      <div className="overview-panel">
        <div className="overview-panel-header">
          <h3>Rescue Team Status</h3>
          <span>{rescueTeams.length} Teams</span>
        </div>

        <div className="team-status-row">
  <span className="team-status-label">
    <span className="team-status-dot available"></span>
    Available Teams
  </span>

  <strong>
    {rescueTeams.filter(
      (team) => team.status !== "ON MISSION"
    ).length}
  </strong>
</div>

<div className="team-status-row">
  <span className="team-status-label">
    <span className="team-status-dot mission"></span>
    Teams on Mission
  </span>

  <strong>
    {rescueTeams.filter(
      (team) => team.status === "ON MISSION"
    ).length}
  </strong>
</div>
</div>
</div>
{selectedIncident && (
  <div
    className="incident-modal-overlay"
    onClick={() => setSelectedIncident(null)}
  >
    <div
      className="incident-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="incident-modal-close"
        onClick={() => setSelectedIncident(null)}
      >
        ×
      </button>

      <h2>{selectedIncident.name}</h2>

      <p>
        <strong>Location:</strong> {selectedIncident.location}
      </p>

      <p>
        <strong>Priority:</strong> {selectedIncident.level}
      </p>

      <p>
        <strong>Incident ID:</strong> {selectedIncident.id}
      </p>

      <button
        className="incident-modal-button"
        onClick={() => setSelectedIncident(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    <div className="activity-panel">
      <div className="overview-panel-header">
        <h3>Disaster Activity Timeline</h3>
        <span>Recent Updates</span>
      </div>

      <div className="activity-item">
        <span className="activity-dot red"></span>
        <div>
          <strong>Urban Fire Alert</strong>
          <p>High priority incident detected in Sector 04</p>
          <small>Emergency response required</small>
        </div>
      </div>

      <div className="activity-item">
        <span className="activity-dot orange"></span>
        <div>
          <strong>Flood Warning</strong>
          <p>Flood alert reported in Riverfront area</p>
          <small>Monitoring ongoing</small>
        </div>
      </div>

      <div className="activity-item">
        <span className="activity-dot green"></span>
        <div>
          <strong>Rescue Team Deployment</strong>
          <p>Rescue teams currently assigned to missions</p>
          <small>Deployment status</small>
        </div>
      </div>
    </div>

  </section>
) : activeTab === "Emergency Alerts" ? (
  
  <section className="alerts-page">
    <div className="panel-header">
      <div>
        <h3>
          <Bell size={20} /> EMERGENCY ALERT CENTER
        </h3>
        <small>ALL SIMULATED DISASTER ALERTS</small>
      </div>
      <span className="count-badge">{alerts.length}</span>
    </div>
<div className="alert-stats">
  <div className="alert-stat pending">
    <span>Pending</span>
    <strong>
     {alerts.filter((alert) => alert.status === "PENDING").length}
    </strong>
  </div>

  <div className="alert-stat acknowledged">
    <span>Acknowledged</span>
    <strong>
      {alerts.filter((alert) => alert.status === "ACKNOWLEDGED").length}
    </strong>
  </div>

  <div className="alert-stat resolved">
    <span>Resolved</span>
    <strong>
      {alerts.filter((alert) => alert.status === "RESOLVED").length}
    </strong>
  </div>
</div>
    <div className="alert-list">

      
      {loadingAlerts ? (
        <p>Loading alerts from backend...</p>
      ) : alertError ? (
        <p>{alertError}</p>
      ) : alerts.length === 0 ? (
        <p>No emergency alerts available.</p>
      ) : (
        alerts.map((alert) => {
          const relatedIncident = incidents.find(
            (incident) => incident.id === alert.incident_id
          );

          return (
            <div
              key={alert.id}
              className={`alert-card ${alert.severity.toLowerCase()}`}
            >
              <div className="alert-icon">
                <Bell size={24} />
              </div>

              <div className="alert-info">
                <strong>{alert.title}</strong>

                <p>{alert.message}</p>

                <span className={`severity ${alert.severity.toLowerCase()}`}>
                  {alert.severity} PRIORITY
                </span>

                <small>Alert ID: {alert.id}</small>
                <small>Incident ID: {alert.incident_id}</small>

                {relatedIncident && (
                  <small>Location: {relatedIncident.location}</small>
                )}

                <strong>STATUS: {alert.status}</strong>

                <div className="alert-actions">
                  <button
                    onClick={() =>
                      updateAlertStatus(alert.id, "ACKNOWLEDGED")
                    }
                    disabled={alert.status !== "PENDING"}
                  >
                    Acknowledge
                  </button>

                  <button
                    onClick={() =>
                      updateAlertStatus(alert.id, "RESOLVED")
                    }
                    disabled={alert.status === "RESOLVED"}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

    </div>
  </section>
) : activeTab === "Rescue Teams" ? (
  <section className="rescue-page">
    <div className="panel-header">
      <div>
        <h3>
          <Users size={20} /> RESCUE TEAM OPERATIONS
        </h3>
        <small>LIVE TEAM DEPLOYMENT STATUS</small>
      </div>
      <span className="count-badge">{rescueTeams.length}</span>
    </div>

    <div className="rescue-grid">
      {rescueTeams.map((team) => (
        <div className="rescue-card" key={team.id}>
          <Users size={28} />

          <h3>{team.name}</h3>
          <p>Team ID: {team.id}</p>
          <p>Zone: {team.zone}</p>
          <p>Members: {team.members}</p>
          <p>Assigned Incident: {team.incident}</p>

          <div className="team-actions">
  <span className={`team-status ${team.status === "AVAILABLE" ? "available" : "on-mission"}`}>
    {team.status}
  </span>

  {team.status === "AVAILABLE" ? (
    <button
      className="team-action-btn"
      onClick={() => updateTeamStatus(team.id, "ON MISSION")}
    >
      Send on Mission
    </button>
  ) : (
    <button
      className="team-action-btn"
      onClick={() => updateTeamStatus(team.id, "AVAILABLE")}
    >
      Set Available
    </button>
  )}
</div>
        </div>
      ))}
    </div>
  </section>
) : (
  <>

        <section className="welcome">
          <div>
            <h2>Disaster Response Overview</h2>
            <p>
              Monitor simulated disaster zones and coordinate emergency
              response operations.
            </p>
          </div>
          <button className="primary-button" onClick={() => setActiveTab("Live Simulation")}>
            <Crosshair size={17} /> Open Simulation
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon red"><AlertTriangle /></div>
            <span>ACTIVE INCIDENTS</span>
            <h2>03</h2>
            <small>Simulated events</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><Users /></div>
            <span>RESCUE PERSONNEL</span>
            <h2>24</h2>
            <small>Demo team count</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><Shield /></div>
            <span>RESPONSE UNITS</span>
            <h2>08</h2>
            <small>Demo deployment</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow"><Zap /></div>
            <span>RESPONSE STATUS</span>
            <h2>READY</h2>
            <small>Simulation environment</small>
          </div>
        </section>

        <section className="workspace">
          <div className="simulation-panel">
            <div className="panel-header">
              <div>
                <h3><Map size={18} /> 3D DISASTER ENVIRONMENT</h3>
                <small>INTERACTIVE CITY SIMULATION</small>
              </div>
              <span className="scene-tag">3D VIEW</span>
            </div>

            <div className="scene">
              <Canvas camera={{ position: [10, 10, 12], fov: 45 }}>
                <CityScene />
              </Canvas>
              <div className="scene-overlay">
                <span>ZONE: NORTH DISTRICT</span>
                <span>MODE: INTERACTIVE</span>
              </div>
            </div>

            <div className="map-footer">
              <span><i className="legend-red" /> Incident zone</span>
              <span><i className="legend-blue" /> Rescue location</span>
              <span><i className="legend-grey" /> Buildings</span>
            </div>
          </div>

          <div className="incident-panel">
            <div className="panel-header">
              <div>
                <h3><Radio size={18} /> INCIDENT MONITOR</h3>
                <small>SIMULATED EMERGENCY EVENTS</small>
              </div>
              <span className="count-badge">03</span>
            </div>

            <div className="incident-list">
              {incidents.map((incident) => {
                const Icon = incident.icon;
                return (
                  <button
                    key={incident.id}
                    className={`incident-item ${
                      selectedIncident.id === incident.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="incident-icon"><Icon size={20} /></div>
                    <div className="incident-info">
                      <strong>{incident.name}</strong>
                      <small>{incident.location}</small>
                      <span className={`severity ${incident.level.toLowerCase()}`}>
                        {incident.level} PRIORITY
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="incident-detail">
              <small>SELECTED INCIDENT</small>
              <h4>{selectedIncident.id}</h4>
              <p>{selectedIncident.name}</p>
              <button onClick={() => setActiveTab("Live Simulation")}>
                <Navigation size={15} /> View in simulation
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>DISASTER RESPONSE INTELLIGENCE PLATFORM</span>
          <span>DEMO ENVIRONMENT · VERSION 1.0</span>
        </footer>
          </>
)}
            </main>
    </div>
  );
}

export default App;