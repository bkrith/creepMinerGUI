/*
CreepMinerGUI - Frontend for Creepskys creepMiner - based on web interface of creepMiner 
Copyright (C) 2017 Vassilis Kritharakis

This program is free software: you can redistribute it and/or modify it under the terms of 
the GNU General Public License as published by the Free Software Foundation, either version 
3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. 
If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const remote            = require('electron').remote
const ipcRenderer       = require('electron').ipcRenderer
const fs                = require('fs')
const dialogPolyfill    = require('dialog-polyfill')
const killProcess       = require('./kill.process.js')
const settings          = require('./settings/gui.conf.js')
const acDetails         = require('./account.details.js')
const ws                = require('./socket.connection.js')
const msg               = require('./message.js')

const dialogModal = document.querySelector('#minerPathDialog')
if (! dialogModal.showModal) dialogPolyfill.registerDialog(dialogModal)

let creepProcess = null

const startBtn = document.getElementById('startBtn')

let startstop = 0
let setToggle = 0


// If everything loaded
// Get application and mining conf

ipcRenderer.on('loadedInfo', (event, data) => {
    settings.getSettings()
    document.getElementById('loaderDiv').classList.add('hide')
})

ipcRenderer.on('resizeInfo', (event, data) => {
    remote.getGlobal('settings').width = data.width
    remote.getGlobal('settings').height = data.height
})

ipcRenderer.on('closedInfo', (event, data) => {
    settings.setSettings()
})


// Fetch account details

acDetails.fetchAcDetails()

// Hide Information Div

let infoTimer = setTimeout(() => {
    document.getElementById('informationDiv').classList.add('hide')
    clearTimeout(infoTimer)
}, 20000)

// Clear areas
/*
setTimeout(() => {
    clearAreas()
}, 1000 * 60 * 60 * 6) // Clear Areas every 6 hour
*/

// Clear Areas

let clearAreas = () => {
    remote.getGlobal('share').lastBlock = ''
    remote.getGlobal('share').lastWinner = ''
    document.getElementById('minerArea').innerHTML = '<span></span>'
    
    document.getElementById('consoleAreaDiv').innerHTML = '<span></span>'

    document.getElementById('logAreaDiv').innerHTML = '<span></span>'
    
    document.getElementById('winnersArea').innerHTML = '<span></span>'
}

// Start/Stop Mining button

let startBtnProcess = () => {
    if (remote.getGlobal('settings').minerPath) {
        startBtn.innerHTML = '<i class="material-icons">stop</i> Stop mining'
        startBtn.classList.remove('greenButton')
        startBtn.classList.add('redButton')
        startstop = 1
        remote.getGlobal('share').restart = false
        clearAreas()
        if (remote.getGlobal('share').connectType) {
            ws.startWs()
        }
        else if (remote.getGlobal('share').pid == null) {
            startMiner()
            ws.startWs()
        }
        else {
            ws.startWs()
        }
    }
    else {
        dialogModal.showModal()
    }
}

let stopBtnProcess = (restart = false) => {
    killProcess.kill(remote.getGlobal('share').pid, '', () => {
        remote.getGlobal('share').pid = null
        ws.stopWs()
        creepProcess = null
        startstop = 0

        startBtn.innerHTML = '<i class="material-icons">play_arrow</i> Start mining'
        startBtn.classList.add('greenButton')
        startBtn.classList.remove('redButton')

        msg.message('warning', 'Miner is offline', 'Miner')

        if (restart) {
            startBtnProcess()
        }
    })
}

document.querySelector('#minerPathDialogBtn').addEventListener('click', () => {
    if (remote.getGlobal('settings').minerPath) {
        dialogModal.close()
        startBtnProcess()
    }
})

startBtn.addEventListener('click', () => {
    if (startstop == 0) {
        startBtnProcess()
    }
    else {
        stopBtnProcess()
    }
})

let startMiner = () => {

    let options = {
        cwd: remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("/"))
    }

    if (remote.getGlobal('share').platform == 'win32') {
        options.cwd = remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("\\"))
    }

    const creepExec = require('child_process').spawn
 
    if (process.platform == 'linux') {
        creepProcess = creepExec(remote.getGlobal('settings').minerPath, [], options)
    }
    else if (process.platform == 'win32') {
        creepProcess = creepExec(remote.getGlobal('settings').minerPath, [], options)
    }

    creepProcess.stderr.on('err', (err) => {
        //console.log(err.toString())
    }) //stderr.pipe(process.stderr)
    creepProcess.stdout.on('data', (data) => {
        //console.log(data.toString())
    }) //stdout.pipe(process.stdout)

    remote.getGlobal('share').pid = creepProcess.pid

    creepProcess.on('exit', (code) => {
        if (code) console.log(`Child exited with code ${code} : `)
    })

}

