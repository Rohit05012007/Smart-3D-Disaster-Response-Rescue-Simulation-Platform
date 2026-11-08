
import { useState, useRef } from "react";
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
} from "lucide-react";
import "./App.css";

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

const incidents = [
  {
    id: "INC-001",
    name: "Urban Fire Alert",
    location: "Sector 04 · North Zone",
    level: "HIGH",
    icon: Flame,
  },
  {
    id: "INC-002",
    name: "Flood Warning",
    location: "Riverfront · East Zone",
    level: "MEDIUM",
    icon: Waves,
  },
  {
    id: "INC-003",
    name: "Building Assessment",
    location: "Central District",
    level: "LOW",
    icon: Building2,
  },
];

function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [alertStatus, setAlertStatus] = useState({
    "INC-001": "PENDING",
    "INC-002": "PENDING",
    "INC-003": "PENDING"
  });

  const updateAlertStatus = (id, status) => {
    setAlertStatus((previous) => ({
      ...previous,
      [id]: status
    }));
  };

    const [rescueTeams, setRescueTeams] = useState([
  {
    id: "TEAM-01",
    name: "Alpha Rescue Team",
    zone: "North Zone",
    members: 6,
    status: "ON MISSION",
    incident: "INC-001"
  },
  {
    id: "TEAM-02",
    name: "Bravo Rescue Team",
    zone: "East Zone",
    members: 5,
    status: "AVAILABLE",
    incident: "None"
  },
  {
    id: "TEAM-03",
    name: "Charlie Rescue Team",
    zone: "Central Zone",
    members: 8,
    status: "AVAILABLE",
    incident: "None"
  }
]);
const updateTeamStatus = (id, status) => {
  setRescueTeams((previous) =>
    previous.map((team) =>
      team.id === id ? { ...team, status } : team
    )
  );
};
  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [alerts, setAlerts] = useState(true);

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
              <span className="status-dot" /> SIMULATION MODE
            </div>
            <button
              className="icon-button"
              onClick={() => setAlerts(!alerts)}
              title="Toggle notifications"
            >
              <Bell size={20} />
              {alerts && <span className="notification-dot" />}
            </button>
            <div className="profile">DR</div>
          </div>
        </header>
        {activeTab === "Emergency Alerts" ? (
  <section className="alerts-page">
    <div className="panel-header">
      <div>
        <h3>
          <Bell size={20} /> EMERGENCY ALERT CENTER
        </h3>
        <small>ALL SIMULATED DISASTER ALERTS</small>
      </div>
      <span className="count-badge">{incidents.length}</span>
    </div>
<div className="alert-stats">
  <div className="alert-stat pending">
    <span>Pending</span>
    <strong>
      {Object.values(alertStatus).filter(
        (status) => status === "PENDING"
      ).length}
    </strong>
  </div>

  <div className="alert-stat acknowledged">
    <span>Acknowledged</span>
    <strong>
      {Object.values(alertStatus).filter(
        (status) => status === "ACKNOWLEDGED"
      ).length}
    </strong>
  </div>

  <div className="alert-stat resolved">
    <span>Resolved</span>
    <strong>
      {Object.values(alertStatus).filter(
        (status) => status === "RESOLVED"
      ).length}
    </strong>
  </div>
</div>
    <div className="alert-list">

      {incidents.map((incident) => {
        const Icon = incident.icon;

        return (
          <div
            key={incident.id}
            className={`alert-card ${incident.level.toLowerCase()}`}
          >
            <div className="alert-icon">
              <Icon size={24} />
            </div>

            <div className="alert-info">
              <strong>{incident.name}</strong>
              <p>{incident.location}</p>
              <span className={`severity ${incident.level.toLowerCase()}`}>
                {incident.level} PRIORITY
              </span>
              <small>Incident ID: {incident.id}</small>
              <strong>
  STATUS: {alertStatus[incident.id]}
</strong>

<div className="alert-actions">
  <button
    onClick={() =>
      updateAlertStatus(incident.id, "ACKNOWLEDGED")
    }
    disabled={alertStatus[incident.id] !== "PENDING"}
  >
    Acknowledge
  </button>

  <button
    onClick={() =>
      updateAlertStatus(incident.id, "RESOLVED")
    }
    disabled={alertStatus[incident.id] === "RESOLVED"}
  >
    Resolve
  </button>
</div>
            </div>
          </div>
        );
      })}
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