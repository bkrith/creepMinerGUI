const { app, BrowserWindow, Tray, Menu }  = require('electron')

const remote                              = require('electron').remote
const killProcess                         = require('./js/kill.process.js')
const fs                                  = require('mz/fs')

const path                                = require('path')
const url                                 = require('url')

global.share = {
  pid: null,
  walletid: null,
  restart: false,
  lastBlock: null,
  lastWinner: null,
  platform: null
}

global.settings = {
  minerPath: '',
  acDetailsWallet: '',
  acDetailsBurst: '',
  acDetailsNumeric: '',
  acDetailsPendingJson: '',
  tray: false,
  firstTime: true
}

global.conf = {
    logging: {
      config: '',
      general: '',
      miner: '',
      path: '',
      plotReader: '',
      plotVerifier: '',
      server: '',
      session: '',
      socket: '',
      wallet: '',
      nonceSubmitter: '',
      output: {
        dirDone: '',
        lastWinner: '',
        nonceConfirmed: '',
        nonceFound: '',
        nonceOnTheWay: '',
        nonceSent: '',
        plotDone: ''
      }
    },
    mining: {
      intensity: '',
      maxBufferSizeMB: '',
      maxPlotReaders: '',
      plots: [],
      submissionMaxRetry: '',
      targetDeadline: '',
      timeout: '',
      walletRequestRetryWaitTime: '',
      walletRequestTries: '',
      passphrase: {
        algorithm: '',
        decrypted: '',
        deleteKey: '',
        encrypted: '',
        iterations: '',
        key: '',
        salt: ''
      },
      urls: {
        miningInfo: '',
        submission: '',
        wallet: ''
      }
    },
    webserver: {
      start: '',
      url: '',
      credentials: {
        'hashed-pass': '',
        'hashed-user': '',
        'plain-pass': '',
        'plain-user': ''
      }
    }
}

let iconPath = ''

let curTray = false

let mainWindow = null

let createWindow = () => {
  fs.readFile('./gui.conf', 'utf8').then((data) => {
    curTray = JSON.parse(data).tray
    
    // Create the browser window.
    if (process.platform == 'linux') {
      iconPath = __dirname + '/cmgui.png'
    global.share.platform = 'linux'
    }
    else if (process.platform == 'win32') {
      iconPath = __dirname + '/cmgui.ico'
    global.share.platform = 'win32'
    }
    else {
      iconPath = __dirname + '/cmgui.icns'
      global.share.platform = 'darwin'
    }

    mainWindow = new BrowserWindow({
      width: 1030, 
      height: 550, 
      minWidth: 910,
      minHeight: 400,
      icon: iconPath
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // mainWindow.webContents.openDevTools()

      let tray = null
      
      if (curTray) {
        tray = new Tray(iconPath)

        let contextMenu = Menu.buildFromTemplate([
          {
            label: 'Show CreepMiner GUI', click: () => {
              mainWindow.show()
            }
          }, {
            label: 'DevTools', click: () => {
              mainWindow.webContents.openDevTools()
            }
          }, {
            label: 'Quit', click: () => {
              app.isQuiting = true
              app.quit()
            }
          }
        ])

        tray.setToolTip('CreepMiner GUI by Vassilis')

        tray.setContextMenu(contextMenu)
      }

    mainWindow.on('minimize', (event) => {
      if (curTray) {
        event.preventDefault()
        mainWindow.hide()
      }
    })

    mainWindow.on('show', () => {
      if (curTray) {
        tray.setHighlightMode('always')
      }
    })

    mainWindow.on('close', (event) => {
      if (!app.isQuiting && curTray) {
        event.preventDefault()
        mainWindow.hide()
      }

      return false
    })

    mainWindow.on('closed', () => {
      killProcess.kill(global.share.pid)
      killProcess.kill(global.share.walletid)

      mainWindow = null
    })
  })
  .catch((err) => {
    console.log(err)
  })
}

app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  killProcess.kill(global.share.pid)
  killProcess.kill(global.share.walletid)

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

