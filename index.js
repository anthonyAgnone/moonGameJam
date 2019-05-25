const electron = require("electron");
const path = require("path");
const url = require("url");

// SET ENV
process.env.NODE_ENV = "development";

const { app, BrowserWindow } = electron;

let mainWindow;

app.on("ready", function() {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    center: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Load html in window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  // Quit app when closed
  mainWindow.on("closed", function() {
    app.quit();
  });
});
