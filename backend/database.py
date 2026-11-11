
import sqlite3
from pathlib import Path

# Database will be created inside the backend folder
DB_PATH = Path(__file__).resolve().parent / "disaster_management.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db():
    connection = get_connection()

    try:
        connection.executescript("""
            CREATE TABLE IF NOT EXISTS incidents (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                location TEXT NOT NULL,
                severity TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'ACTIVE',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS rescue_teams (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                zone TEXT NOT NULL,
                members INTEGER NOT NULL DEFAULT 0,
                assigned_incident TEXT,
                status TEXT NOT NULL DEFAULT 'AVAILABLE',
                FOREIGN KEY (assigned_incident)
                    REFERENCES incidents(id)
                    ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                incident_id TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT,
                severity TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (incident_id)
                    REFERENCES incidents(id)
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        connection.commit()
        print("Database initialized successfully.")

    finally:
        connection.close()
