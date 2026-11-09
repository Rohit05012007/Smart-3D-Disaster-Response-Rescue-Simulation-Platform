from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class HealthHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/health":
            data = {
                "status": "healthy",
                "message": "Disaster Management Backend is Running!"
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            self.wfile.write(json.dumps(data).encode())

        else:
            self.send_response(404)
            self.end_headers()


server = HTTPServer(("127.0.0.1", 8000), HealthHandler)

print("Disaster Management Backend Running on port 8000")

server.serve_forever()