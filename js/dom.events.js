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
const minerSettings     = require('./settings/mining.conf.js')
const settings          = require('./settings/gui.conf.js')
const acDetails         = require('./account.details.js')
const msg               = require('./message.js')
const fsAccess          = require('./fs.access.js')
const dialogPolyfill    = require('dialog-polyfill')

const wizardDialogModal = document.querySelector('#wizardDialog')
if (! wizardDialogModal.showModal) dialogPolyfill.registerDialog(wizardDialogModal)


// Some init sets

    document.getElementById('fldWsUrl').disabled = true
    document.getElementById('fldWsUrl').value = ('ws://' + remote.getGlobal('conf').webserver.url.split('//')[1])    

// Element to Bottom

let gotoBottom = () => {
   if (remote.getGlobal('share').lastWinner) document.getElementById(remote.getGlobal('share').lastWinner).scrollIntoView(false)
   if (remote.getGlobal('share').lastBlock) document.getElementById(remote.getGlobal('share').lastBlock).scrollIntoView(false)
   document.getElementById('consoleAreaDiv').scrollIntoView(false)
   document.getElementById('logAreaDiv').scrollIntoView(false)
}

document.getElementById('startOption').addEventListener('click', () => {
    document.getElementById('fldWsUrl').disabled = true
    remote.getGlobal('share').connectType = null
})

document.getElementById('wsUrlOption').addEventListener('click', () => {
    document.getElementById('fldWsUrl').disabled = false
    remote.getGlobal('share').connectType = document.getElementById('fldWsUrl').value
})

document.getElementById('renewWalletInfo').addEventListener('click', () => {
    document.getElementById('renewWalletInfo').classList.add('hide')
    acDetails.fetchAcDetailsOnce()
})

document.getElementById('wizardDialogBtn').addEventListener('click', () => {
    remote.getGlobal('settings').firstTime = false
    remote.getGlobal('settings').minerPath = document.getElementById('fldMinerPathd').value
    remote.getGlobal('settings').acDetailsWallet = document.getElementById('acDetailsWalletd').value
    remote.getGlobal('settings').acDetailsNumeric = document.getElementById('acDetailsNumericd').value
    remote.getGlobal('settings').acDetailsBurst = document.getElementById('acDetailsBurstd').value
    remote.getGlobal('settings').acDetailsPendingJson = document.getElementById('acDetailsPendingJsond').value
    settings.setSettings()
    
    let confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("/")) + '/mining.conf'
    if (remote.getGlobal('share').platform == 'win32') {
		confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("\\")) + '\\mining.conf'
    }
    fsAccess.backupMiningConf(confFile)

    acDetails.fetchAcDetailsOnce()

    document.getElementById('myWalletBurst').innerHTML = remote.getGlobal('settings').acDetailsBurst
    
    wizardDialogModal.close()
})

document.getElementById('wizardDialogCancelBtn').addEventListener('click', () => {
    let confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("/")) + '/mining.conf'
    if (remote.getGlobal('share').platform == 'win32') {
		confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("\\")) + '\\mining.conf'
    }
    fsAccess.backupMiningConf(confFile)
    
    wizardDialogModal.close()
})

document.getElementById('wizardDialogHideBtn').addEventListener('click', () => {
    remote.getGlobal('settings').firstTime = false
    settings.setSettings()
    
    let confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("/")) + '/mining.conf'
    if (remote.getGlobal('share').platform == 'win32') {
		confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("\\")) + '\\mining.conf'
    }
    fsAccess.backupMiningConf(confFile)
    
    wizardDialogModal.close()
})

document.getElementById('backupBtn').addEventListener('click', () => {
    let confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("/")) + '/mining.conf'
    if (remote.getGlobal('share').platform == 'win32') {
		confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("\\")) + '\\mining.conf'
    }

    fsAccess.backupMiningConf(confFile)
})

document.getElementById('restoreBtn').addEventListener('click', () => {
    let confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("/")) + '/mining.conf'
    if (remote.getGlobal('share').platform == 'win32') {
		confFile = document.getElementById('fldMinerPathd').value.substring(0, document.getElementById('fldMinerPathd').value.lastIndexOf("\\")) + '\\mining.conf'
    }

    fsAccess.restoreMiningConf(confFile)
})

document.getElementById('minerBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.remove('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.add('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('infoBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.remove('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.add('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('consoleBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.remove('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.add('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('winnersBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.remove('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.add('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('setBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.remove('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.add('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()

        settings.getSettings()
})

document.getElementById('logBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.remove('hide')
        document.getElementById('creditArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.add('sideButtonActive')
        document.getElementById('creditBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('creditBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')
        document.getElementById('logArea').classList.add('hide')
        document.getElementById('creditArea').classList.remove('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')
        document.getElementById('logBtn').classList.remove('sideButtonActive')
        document.getElementById('creditBtn').classList.add('sideButtonActive')

        gotoBottom()
})

let dialog = remote.dialog
let check = true

let selectMiner = () => {
    dialog.showOpenDialog((fileName) => {
        if (fileName) {
            remote.getGlobal('settings').minerPath = fileName[0]
            settings.setSettings()
            minerSettings.getConf()
            document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(fileName[0])
            document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(fileName[0])
        }
    })
} 

document.getElementById('selectMinerBtn').addEventListener('click', () => {
        selectMiner()
})

document.getElementById('fldMinerPathd').addEventListener('blur', () => {
    // let thisVal = document.getElementById('fldMinerPathd')
    // remote.getGlobal('settings').minerPath = thisVal.value
    // settings.setSettings()
    // document.getElementById('fldMinerPathd').parentElement.MaterialTextfield.change(thisVal.value)
    // document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsWalletd').addEventListener('blur', () => {
    // let thisVal = document.getElementById('acDetailsWalletd')
    // remote.getGlobal('settings').acDetailsWallet = thisVal.value
    // settings.setSettings()
    // document.getElementById('acDetailsWalletd').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsBurstd').addEventListener('blur', () => {
    // let thisVal = document.getElementById('acDetailsBurstd')
    // remote.getGlobal('settings').acDetailsBurst = thisVal.value
    // settings.setSettings()
    // document.getElementById('acDetailsBurstd').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsNumericd').addEventListener('blur', () => {
    // let thisVal = document.getElementById('acDetailsNumericd')
    // remote.getGlobal('settings').acDetailsNumeric = thisVal.value
    // settings.setSettings()
    // document.getElementById('acDetailsNumericd').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsPendingJsond').addEventListener('blur', () => {
    // let thisVal = document.getElementById('acDetailsPendingJsond')
    // remote.getGlobal('settings').acDetailsPendingJson = thisVal.value
    // settings.setSettings()
    // document.getElementById('acDetailsPendingJsond').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldMinerPath').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMinerPath')
    remote.getGlobal('settings').minerPath = thisVal.value
    settings.setSettings()
    minerSettings.getConf()
    document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(thisVal.value)
    document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsWallet')
    remote.getGlobal('settings').acDetailsWallet = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsWallet').parentElement.MaterialTextfield.change(thisVal.value)
    acDetails.fetchAcDetailsOnce()
})

document.getElementById('acDetailsBurst').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsBurst')
    remote.getGlobal('settings').acDetailsBurst = thisVal.value
    settings.setSettings()
    document.getElementById('myWalletBurst').innerHTML = remote.getGlobal('settings').acDetailsBurst
    document.getElementById('acDetailsBurst').parentElement.MaterialTextfield.change(thisVal.value)
    acDetails.fetchAcDetailsOnce()
})

document.getElementById('acDetailsNumeric').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsNumeric')
    remote.getGlobal('settings').acDetailsNumeric = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsNumeric').parentElement.MaterialTextfield.change(thisVal.value)
    acDetails.fetchAcDetailsOnce()
})

document.getElementById('acDetailsPendingJson').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsPendingJson')
    remote.getGlobal('settings').acDetailsPendingJson = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsPendingJson').parentElement.MaterialTextfield.change(thisVal.value)
    acDetails.fetchAcDetailsOnce()
})


// mining.conf values

document.getElementById('fldConfig').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldConfig')
    remote.getGlobal('conf').logging.config = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldGeneral').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldGeneral')
    remote.getGlobal('conf').logging.general = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)  
})

document.getElementById('fldMiner').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMiner')
    remote.getGlobal('conf').logging.miner = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)    
})

document.getElementById('fldNonceSubmitter').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldNonceSubmitter')
    remote.getGlobal('conf').logging.nonceSubmitter = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)  
})

document.getElementById('fldPath').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPath')
    remote.getGlobal('conf').logging.path = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlotReader').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlotReader')
    remote.getGlobal('conf').logging.plotReader = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlotVerifier').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlotVerifier')
    remote.getGlobal('conf').logging.plotVerifier = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value) 
})

document.getElementById('fldServer').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldServer')
    remote.getGlobal('conf').logging.server = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSession').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSession')
    remote.getGlobal('conf').logging.session = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSocket').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSocket')
    remote.getGlobal('conf').logging.socket = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWallet')
    remote.getGlobal('conf').logging.wallet = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldIntensity').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldIntensity')
    remote.getGlobal('conf').mining.intensity = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldMaxBufferSizeMB').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMaxBufferSizeMB')
    remote.getGlobal('conf').mining.maxBufferSizeMB = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fdlPlots').addEventListener('blur', () => {
    let thisVal = document.getElementById('fdlPlots')
    let thisValue = thisVal.value.split('\n')
    let plotsS = []
    for (let i = 0; i < thisValue.length; i++) {
        if (thisValue[i].length > 0) plotsS.push(thisValue[i].trim())
    }
    remote.getGlobal('conf').mining.plots = plotsS
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
    
})

document.getElementById('fldMaxPlotReaders').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMaxPlotReaders')
    remote.getGlobal('conf').mining.maxPlotReaders = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSubmissionMaxRetry').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSubmissionMaxRetry')
    remote.getGlobal('conf').mining.submissionMaxRetry = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldTargetDeadline').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldTargetDeadline')
    remote.getGlobal('conf').mining.targetDeadline = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldTimeout').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldTimeout')
    remote.getGlobal('conf').mining.timeout = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWalletRequestRetryWaitTime').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWalletRequestRetryWaitTime')
    remote.getGlobal('conf').mining.walletRequestRetryWaitTime = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWalletRequestTries').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWalletRequestTries')
    remote.getGlobal('conf').mining.walletRequestTries = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldAlgorithm').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldAlgorithm')
    remote.getGlobal('conf').mining.passphrase.algorithm = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldDecrypted').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldDecrypted')
    remote.getGlobal('conf').mining.passphrase.decrypted = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldEncrypted').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldEncrypted')
    remote.getGlobal('conf').mining.passphrase.encrypted = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldIterations').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldIterations')
    remote.getGlobal('conf').mining.passphrase.iterations = parseInt(thisVal.value)
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldKey').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldKey')
    remote.getGlobal('conf').mining.passphrase.key = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSalt').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSalt')
    remote.getGlobal('conf').mining.passphrase.salt = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldMiningInfo').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMiningInfo')
    remote.getGlobal('conf').mining.urls.miningInfo = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSubmission').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSubmission')
    remote.getGlobal('conf').mining.urls.submission = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldUrlsWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldUrlsWallet')
    remote.getGlobal('conf').mining.urls.wallet = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldUrl').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldUrl')
    remote.getGlobal('conf').webserver.url = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldHashedPass').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldHashedPass')
    remote.getGlobal('conf').webserver.credentials['hashed-pass'] = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldHashedUser').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldHashedUser')
    remote.getGlobal('conf').webserver.credentials['hashed-user'] = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlainPass').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlainPass')
    remote.getGlobal('conf').webserver.credentials['plain-pass'] = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlainUser').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlainUser')
    remote.getGlobal('conf').webserver.credentials['plain-user'] = thisVal.value
    minerSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})


let hasClass = (element, cls) => {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
}

document.getElementById('fldTrayIcon').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkTrayIcon'), 'is-checked')) check = false
    remote.getGlobal('settings').tray = check
    settings.setSettings()
})

document.getElementById('fldDirDone').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkDirDone'), 'is-checked')) check = false
    remote.getGlobal('conf').logging.output.dirDone = check
    minerSettings.setConf()
})

document.getElementById('fldLastWinner').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkLastWinner'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.lastWinner = check
    minerSettings.setConf()
})

document.getElementById('fldNonceConfirmed').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceConfirmed'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceConfirmed = check
    minerSettings.setConf()
})

document.getElementById('fldNonceFound').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceFound'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceFound = check
    minerSettings.setConf()
})

document.getElementById('fldNonceOnTheWay').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceOnTheWay'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceOnTheWay = check
    minerSettings.setConf()
})

document.getElementById('fldNonceSent').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceSent'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceSent = check
    minerSettings.setConf()
})

document.getElementById('fldPlotDone').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkPlotDone'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.plotDone = check
    minerSettings.setConf()
})

document.getElementById('fldDeleteKey').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkDeleteKey'), 'is-checked')) check = false
    
    remote.getGlobal('conf').mining.passphrase.deleteKey = check
    minerSettings.setConf()
})

document.getElementById('fldStart').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkStart'), 'is-checked')) check = false
    
    remote.getGlobal('conf').webserver.start = check
    minerSettings.setConf()
})

document.getElementById('fldSound').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkSound'), 'is-checked')) check = false
    
    remote.getGlobal('settings').sound = check
    settings.setSettings()
})

document.getElementById('fldNotification').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNotification'), 'is-checked')) check = false
    
    remote.getGlobal('settings').notification = check
    settings.setSettings()
})
