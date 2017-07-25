'use strict'

const remote        = require('electron').remote
const confSettings  = require('./settings/mining.conf.js')
const settings      = require('./settings/gui.conf.js')


// Element to Bottom

let gotoBottom = () => {
   if (remote.getGlobal('share').lastWinner) document.getElementById(remote.getGlobal('share').lastWinner).scrollIntoView(false)
   if (remote.getGlobal('share').lastBlock) document.getElementById(remote.getGlobal('share').lastBlock).scrollIntoView(false)
   document.getElementById('consoleAreaDiv').scrollIntoView(false)
}

document.getElementById('minerBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.remove('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')

        document.getElementById('minerBtn').classList.add('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('infoBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.remove('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.add('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('consoleBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.remove('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.add('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('winnersBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.remove('hide')
        document.getElementById('settingsArea').classList.add('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.add('sideButtonActive')
        document.getElementById('setBtn').classList.remove('sideButtonActive')

        gotoBottom()
})

document.getElementById('setBtn').addEventListener('click', () => {
        document.getElementById('infoArea').classList.add('hide')
        document.getElementById('minerArea').classList.add('hide')
        document.getElementById('consoleArea').classList.add('hide')
        document.getElementById('winnersArea').classList.add('hide')
        document.getElementById('settingsArea').classList.remove('hide')

        document.getElementById('minerBtn').classList.remove('sideButtonActive')
        document.getElementById('infoBtn').classList.remove('sideButtonActive')
        document.getElementById('consoleBtn').classList.remove('sideButtonActive')
        document.getElementById('winnersBtn').classList.remove('sideButtonActive')
        document.getElementById('setBtn').classList.add('sideButtonActive')

        gotoBottom()

        settings.getSettings()
})

let dialog = remote.dialog
let check = true

let selectMiner = () => {
    dialog.showOpenDialog((fileName) => {
        if (fileName) {
            remote.getGlobal('settings').minerPath = fileName[0]
            settings.setSettings()
            document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(fileName[0])
            document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(fileName[0])
        }
    })
} 

document.getElementById('selectMinerBtn').addEventListener('click', () => {
        selectMiner()
})

document.getElementById('fldMinerPath').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMinerPath')
    remote.getGlobal('settings').minerPath = thisVal.value
    settings.setSettings()
    document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(thisVal.value)
    document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsWallet')
    remote.getGlobal('settings').acDetailsWallet = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsWallet').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsBurst').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsBurst')
    remote.getGlobal('settings').acDetailsBurst = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsBurst').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsNumeric').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsNumeric')
    remote.getGlobal('settings').acDetailsNumeric = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsNumeric').parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('acDetailsPendingJson').addEventListener('blur', () => {
    let thisVal = document.getElementById('acDetailsPendingJson')
    remote.getGlobal('settings').acDetailsPendingJson = thisVal.value
    settings.setSettings()
    document.getElementById('acDetailsPendingJson').parentElement.MaterialTextfield.change(thisVal.value)
})


// mining.conf values

document.getElementById('fldConfig').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldConfig')
    remote.getGlobal('conf').logging.config = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldGeneral').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldGeneral')
    remote.getGlobal('conf').logging.general = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)  
})

document.getElementById('fldMiner').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMiner')
    remote.getGlobal('conf').logging.miner = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)    
})

document.getElementById('fldNonceSubmitter').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldNonceSubmitter')
    remote.getGlobal('conf').logging.nonceSubmitter = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)  
})

document.getElementById('fldPath').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPath')
    remote.getGlobal('conf').logging.path = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlotReader').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlotReader')
    remote.getGlobal('conf').logging.plotReader = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlotVerifier').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlotVerifier')
    remote.getGlobal('conf').logging.plotVerifier = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value) 
})

document.getElementById('fldServer').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldServer')
    remote.getGlobal('conf').logging.server = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSession').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSession')
    remote.getGlobal('conf').logging.session = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSocket').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSocket')
    remote.getGlobal('conf').logging.socket = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWallet')
    remote.getGlobal('conf').logging.wallet = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldIntensity').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldIntensity')
    remote.getGlobal('conf').mining.intensity = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldMaxBufferSizeMB').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMaxBufferSizeMB')
    remote.getGlobal('conf').mining.maxBufferSizeMB = parseInt(thisVal.value)
    confSettings.setConf()
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
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
    
})

document.getElementById('fldMaxPlotReaders').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMaxPlotReaders')
    remote.getGlobal('conf').mining.maxPlotReaders = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSubmissionMaxRetry').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSubmissionMaxRetry')
    remote.getGlobal('conf').mining.submissionMaxRetry = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldTargetDeadline').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldTargetDeadline')
    remote.getGlobal('conf').mining.targetDeadline = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldTimeout').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldTimeout')
    remote.getGlobal('conf').mining.timeout = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWalletRequestRetryWaitTime').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWalletRequestRetryWaitTime')
    remote.getGlobal('conf').mining.walletRequestRetryWaitTime = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldWalletRequestTries').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldWalletRequestTries')
    remote.getGlobal('conf').mining.walletRequestTries = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldAlgorithm').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldAlgorithm')
    remote.getGlobal('conf').mining.passphrase.algorithm = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldDecrypted').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldDecrypted')
    remote.getGlobal('conf').mining.passphrase.decrypted = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldEncrypted').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldEncrypted')
    remote.getGlobal('conf').mining.passphrase.encrypted = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldIterations').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldIterations')
    remote.getGlobal('conf').mining.passphrase.iterations = parseInt(thisVal.value)
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldKey').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldKey')
    remote.getGlobal('conf').mining.passphrase.key = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSalt').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSalt')
    remote.getGlobal('conf').mining.passphrase.salt = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldMiningInfo').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldMiningInfo')
    remote.getGlobal('conf').mining.urls.miningInfo = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldSubmission').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldSubmission')
    remote.getGlobal('conf').mining.urls.submission = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldUrlsWallet').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldUrlsWallet')
    remote.getGlobal('conf').mining.urls.wallet = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldUrl').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldUrl')
    remote.getGlobal('conf').webserver.url = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldHashedPass').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldHashedPass')
    remote.getGlobal('conf').webserver.credentials['hashed-pass'] = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldHashedUser').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldHashedUser')
    remote.getGlobal('conf').webserver.credentials['hashed-user'] = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlainPass').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlainPass')
    remote.getGlobal('conf').webserver.credentials['plain-pass'] = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})

document.getElementById('fldPlainUser').addEventListener('blur', () => {
    let thisVal = document.getElementById('fldPlainUser')
    remote.getGlobal('conf').webserver.credentials['plain-user'] = thisVal.value
    confSettings.setConf()
    thisVal.parentElement.MaterialTextfield.change(thisVal.value)
})


let hasClass = (element, cls) => {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


document.getElementById('fldDirDone').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkDirDone'), 'is-checked')) check = false
    remote.getGlobal('conf').logging.output.dirDone = check
    confSettings.setConf()
})

document.getElementById('fldLastWinner').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkLastWinner'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.lastWinner = check
    confSettings.setConf()
})

document.getElementById('fldNonceConfirmed').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceConfirmed'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceConfirmed = check
    confSettings.setConf()
})

document.getElementById('fldNonceFound').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceFound'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceFound = check
    confSettings.setConf()
})

document.getElementById('fldNonceOnTheWay').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceOnTheWay'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceOnTheWay = check
    confSettings.setConf()
})

document.getElementById('fldNonceSent').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkNonceSent'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.nonceSent = check
    confSettings.setConf()
})

document.getElementById('fldPlotDone').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkPlotDone'), 'is-checked')) check = false
    
    remote.getGlobal('conf').logging.output.plotDone = check
    confSettings.setConf()
})

document.getElementById('fldDeleteKey').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkDeleteKey'), 'is-checked')) check = false
    
    remote.getGlobal('conf').mining.passphrase.deleteKey = check
    confSettings.setConf()
})

document.getElementById('fldStart').addEventListener('click', () => {
    check = true
    if (hasClass(document.getElementById('checkStart'), 'is-checked')) check = false
    
    remote.getGlobal('conf').webserver.start = check
    confSettings.setConf()
})

