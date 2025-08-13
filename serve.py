import http.server
import socketserver
import webbrowser
from threading import Timer

PORT = 8000
ADDRESS = "localhost"
URL = f"http://{ADDRESS}:{PORT}"

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Add .js to the extensions map with the correct MIME type
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
    }
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

def open_browser():
    """
    Opens the default web browser to the server's URL.
    """
    webbrowser.open_new(URL)

if __name__ == "__main__":
    # We use a TCP server to handle requests
    with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd:
        print(f"Serving at {URL}")

        # Open the browser automatically after a short delay
        Timer(1, open_browser).start()

        print("Press Ctrl+C to stop the server.")

        # This will keep the server running until you interrupt it with Ctrl+C
        httpd.serve_forever()
