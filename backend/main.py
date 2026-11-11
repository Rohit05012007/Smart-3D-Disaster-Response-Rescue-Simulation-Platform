
from contextlib import asynccontextmanager
from datetime import datetime
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from .database import get_connection, init_db
except ImportError:
    from database import get_connection, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Disaster Management API",
    description="Backend API for Disaster Response and Rescue Simulation",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IncidentCreate(BaseModel):
    title: str = Field(min_length=1)
    location: str = Field(min_length=1)
    severity: str
    description: str = ""
    status: str = "ACTIVE"


class IncidentUpdate(BaseModel):
    title: str | None = None
    location: str | None = None
    severity: str | None = None
    description: str | None = None
    status: str | None = None

class AlertCreate(BaseModel):
    incident_id: str
    title: str = Field(min_length=1)
    message: str = ""
    severity: str
    status: str = "PENDING"


class AlertUpdate(BaseModel):
    status: str
@app.get("/")
def home():
    return {
        "message": "Disaster Management Backend is Running!",
        "status": "Operational"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/incidents")
def get_incidents():
    connection = get_connection()
    try:
        rows = connection.execute(
            "SELECT * FROM incidents ORDER BY created_at DESC"
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


@app.post("/incidents", status_code=201)
def create_incident(incident: IncidentCreate):
    connection = get_connection()
    try:
        incident_id = f"INC-{uuid4().hex[:8].upper()}"

        connection.execute(
            """
            INSERT INTO incidents
            (id, title, location, severity, status, description)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                incident_id,
                incident.title.strip(),
                incident.location.strip(),
                incident.severity.upper(),
                incident.status.upper(),
                incident.description
            )
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM incidents WHERE id = ?",
            (incident_id,)
        ).fetchone()

        return dict(row)
    finally:
        connection.close()


@app.get("/incidents/{incident_id}")
def get_incident(incident_id: str):
    connection = get_connection()
    try:
        row = connection.execute(
            "SELECT * FROM incidents WHERE id = ?",
            (incident_id,)
        ).fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="Incident not found")

        return dict(row)
    finally:
        connection.close()


@app.put("/incidents/{incident_id}")
def update_incident(incident_id: str, incident: IncidentUpdate):
    updates = incident.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided")

    allowed_fields = {
        "title", "location", "severity", "description", "status"
    }

    if not set(updates).issubset(allowed_fields):
        raise HTTPException(status_code=400, detail="Invalid fields")

    for field in ("title", "location"):
        if field in updates and updates[field] is not None:
            updates[field] = updates[field].strip()
            if not updates[field]:
                raise HTTPException(
                    status_code=422,
                    detail=f"{field} cannot be empty"
                )

    for field in ("severity", "status"):
        if field in updates and updates[field] is not None:
            updates[field] = updates[field].upper()

    updates["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    connection = get_connection()
    try:
        existing = connection.execute(
            "SELECT id FROM incidents WHERE id = ?",
            (incident_id,)
        ).fetchone()

        if existing is None:
            raise HTTPException(status_code=404, detail="Incident not found")

        assignments = ", ".join(f"{field} = ?" for field in updates)
        values = list(updates.values()) + [incident_id]

        connection.execute(
            f"UPDATE incidents SET {assignments} WHERE id = ?",
            values
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM incidents WHERE id = ?",
            (incident_id,)
        ).fetchone()

        return dict(row)
    finally:
        connection.close()


@app.delete("/incidents/{incident_id}")
def delete_incident(incident_id: str):
    connection = get_connection()
    try:
        cursor = connection.execute(
            "DELETE FROM incidents WHERE id = ?",
            (incident_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Incident not found")

        connection.commit()
        return {
            "message": "Incident deleted successfully",
            "id": incident_id
        }
    finally:
        connection.close()
@app.get("/alerts")
def get_alerts():
    connection = get_connection()
    try:
        rows = connection.execute(
            "SELECT * FROM alerts ORDER BY created_at DESC"
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


@app.post("/alerts", status_code=201)
def create_alert(alert: AlertCreate):
    connection = get_connection()
    try:
        incident = connection.execute(
            "SELECT id FROM incidents WHERE id = ?",
            (alert.incident_id,)
        ).fetchone()

        if incident is None:
            raise HTTPException(status_code=404, detail="Incident not found")

        alert_id = f"ALT-{uuid4().hex[:8].upper()}"

        connection.execute(
            """
            INSERT INTO alerts
            (id, incident_id, title, message, severity, status)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                alert_id,
                alert.incident_id,
                alert.title.strip(),
                alert.message,
                alert.severity.upper(),
                alert.status.upper()
            )
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM alerts WHERE id = ?",
            (alert_id,)
        ).fetchone()

        return dict(row)
    finally:
        connection.close()


@app.patch("/alerts/{alert_id}")
def update_alert(alert_id: str, alert: AlertUpdate):
    status = alert.status.upper()

    if status not in ("PENDING", "ACKNOWLEDGED", "RESOLVED"):
        raise HTTPException(status_code=400, detail="Invalid alert status")

    connection = get_connection()
    try:
        cursor = connection.execute(
            "UPDATE alerts SET status = ? WHERE id = ?",
            (status, alert_id)
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Alert not found")

        connection.commit()

        row = connection.execute(
            "SELECT * FROM alerts WHERE id = ?",
            (alert_id,)
        ).fetchone()

        return dict(row)
    finally:
        connection.close()


@app.delete("/alerts/{alert_id}")
def delete_alert(alert_id: str):
    connection = get_connection()
    try:
        cursor = connection.execute(
            "DELETE FROM alerts WHERE id = ?",
            (alert_id,)
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Alert not found")

        connection.commit()

        return {
            "message": "Alert deleted successfully",
            "id": alert_id
        }
    finally:
        connection.close()