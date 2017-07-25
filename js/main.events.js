'use strict'

const remote            = require('electron').remote
const fs                = require('fs')
const dialogPolyfill    = require('dialog-polyfill')
const killProcess       = require('./kill.process.js')
const settings          = require('./settings/gui.conf.js')
const acDetails         = require('./account.details.js')

const dialogModal = document.querySelector('#minerPathDialog')
if (! dialogModal.showModal) dialogPolyfill.registerDialog(dialogModal)

let creepProcess = null

const startBtn = document.getElementById('startBtn')

let startstop = 0
let setToggle = 0

// Fetch account details

acDetails.fetchAcDetails()

// Get application and mining conf

settings.getSettings()

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
    
    document.getElementById('winnersArea').innerHTML = '<span></span>'
}

// Start/Stop Mining button

let startBtnProcess = () => {
    if (remote.getGlobal('settings').minerPath) {
        startBtn.innerHTML = '<i class="material-icons">stop</i> Stop mining'
        startBtn.classList.remove('mdl-button--primary')
        startBtn.classList.add('mdl-button--accent')
        startstop = 1
        remote.getGlobal('share').restart = false
        clearAreas()
        if (remote.getGlobal('share').pid == null) {
            startMiner()
        }
    }
    else {
        dialogModal.showModal()
    }
}

let stopBtnProcess = (restart = false) => {
    killProcess.kill(remote.getGlobal('share').pid, '', () => {
        remote.getGlobal('share').pid = null
        creepProcess = null
        startstop = 0

        startBtn.innerHTML = '<i class="material-icons">play_arrow</i> Start mining'
        startBtn.classList.add('mdl-button--primary')
        startBtn.classList.remove('mdl-button--accent')

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
    }) //stderr.pipe(process.stderr);
    creepProcess.stdout.on('data', (data) => {
        //console.log(data.toString())
    }) //stdout.pipe(process.stdout);

    remote.getGlobal('share').pid = creepProcess.pid

    creepProcess.on('exit', (code) => {
        if (code) console.log(`Child exited with code ${code} : `)
    })

}

