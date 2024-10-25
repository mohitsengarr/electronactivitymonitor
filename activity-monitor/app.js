const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const { autoUpdater } = require("electron-updater")
const log = require('electron-log')

let window = null

// Configure logging
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function createWindow() {
  window = new BrowserWindow({
    width: 500,
    height: 400,
    titleBarStyle: 'hiddenInset',
    backgroundColor: "#111",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
    // Check for updates after window is shown
    autoUpdater.checkForUpdatesAndNotify()
  })
}

app.on('ready', () => {
  createWindow()
})

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available.', info)
})

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.', info)
})

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater. ', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  log.info(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded', info)
  // Wait 5 seconds, then quit and install
  // In your app, you could display a dialog asking the user if they want to update
  setTimeout(() => {
    autoUpdater.quitAndInstall()  
  }, 5000)
})
