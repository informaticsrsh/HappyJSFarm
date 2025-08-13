import http.server
import socketserver
import webbrowser
from threading import Timer
import mimetypes

PORT = 8000
ADDRESS = "localhost"
URL = f"http://{ADDRESS}:{PORT}"

# Add .js to the extensions map with the correct MIME type
mimetypes.add_type("application/javascript", ".js")

def open_browser():
    """
    Opens the default web browser to the server's URL.
    """
    webbrowser.open_new(URL)

if __name__ == "__main__":
    Handler = http.server.SimpleHTTPRequestHandler
    # We use a TCP server to handle requests
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at {URL}")

        # Open the browser automatically after a short delay
        Timer(1, open_browser).start()

        print("Press Ctrl+C to stop the server.")

        # This will keep the server running until you interrupt it with Ctrl+C
        httpd.serve_forever()
