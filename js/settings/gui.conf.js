'use strinct'

const remote            = require('electron').remote
const acDetails         = require('../account.details.js')
const dialogPolyfill    = require('dialog-polyfill')
const fsAccess          = require('../fs.access.js')

const minerSettings = require('./mining.conf.js')

const wizardDialogModal = document.querySelector('#wizardDialog')
if (! wizardDialogModal.showModal) dialogPolyfill.registerDialog(wizardDialogModal)

let setValues = (data) => {
    remote.getGlobal('settings').minerPath = data.minerPath
    remote.getGlobal('settings').acDetailsWallet = data.acDetailsWallet
    remote.getGlobal('settings').acDetailsBurst = data.acDetailsBurst
    remote.getGlobal('settings').acDetailsNumeric = data.acDetailsNumeric
    remote.getGlobal('settings').acDetailsPendingJson = data.acDetailsPendingJson
    remote.getGlobal('settings').tray = data.tray
    remote.getGlobal('settings').firstTime = data.firstTime

    
    if (remote.getGlobal('settings').firstTime) {
        wizardDialogModal.showModal()
    }

    setFormsValues()
    
    acDetails.fetchAcDetailsOnceOnly()

    minerSettings.getConf()
}

let setFormsValues = () => {
    if (remote.getGlobal('settings').minerPath) {
        document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
        document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
    }

    if (remote.getGlobal('settings').tray) document.getElementById('fldTrayIcon').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldTrayIcon').parentElement.MaterialCheckbox.uncheck()

    document.getElementById('myWalletBurst').innerHTML = remote.getGlobal('settings').acDetailsBurst

    document.getElementById('acDetailsWallet').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsWallet)
    document.getElementById('acDetailsBurst').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsBurst)
    document.getElementById('acDetailsNumeric').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsNumeric)
    document.getElementById('acDetailsPendingJson').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsPendingJson)
}

module.exports = {

    getSettings: () => {
        fsAccess.get('gui.conf', 'GUI settings operations done', true).then((data) => {
            setValues(data)
            return data
        })
    },

    setSettings: () => {
        fsAccess.set('gui.conf', remote.getGlobal('settings'), 'GUI settings operations done', true)
    }

}