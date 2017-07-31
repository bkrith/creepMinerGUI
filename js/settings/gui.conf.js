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

'use strinct'

const remote            = require('electron').remote
const acDetails         = require('../account.details.js')
const fsAccess          = require('../fs.access.js')

const minerSettings = require('./mining.conf.js')

const wizardDialogModal = document.querySelector('#wizardDialog')
if (! wizardDialogModal.showModal) dialogPolyfill.registerDialog(wizardDialogModal)

let setValues = (data, updateFields = true) => {
    remote.getGlobal('settings').minerPath = data.minerPath
    remote.getGlobal('settings').acDetailsWallet = data.acDetailsWallet
    remote.getGlobal('settings').acDetailsBurst = data.acDetailsBurst
    remote.getGlobal('settings').acDetailsNumeric = data.acDetailsNumeric
    remote.getGlobal('settings').acDetailsPendingJson = data.acDetailsPendingJson
    remote.getGlobal('settings').tray = data.tray
    remote.getGlobal('settings').firstTime = data.firstTime
    remote.getGlobal('settings').sound = data.sound
    remote.getGlobal('settings').notification = data.notification
    
    if (remote.getGlobal('settings').firstTime) {
        wizardDialogModal.showModal()
    }
    else {
        acDetails.fetchAcDetailsOnceOnly()

        minerSettings.getConf(updateFields)
    }
}

let setFormsValues = () => {
    if (remote.getGlobal('settings').minerPath) {
        document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
        document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
    }

    if (remote.getGlobal('settings').tray) document.getElementById('fldTrayIcon').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldTrayIcon').parentElement.MaterialCheckbox.uncheck()

    if (remote.getGlobal('settings').sound) document.getElementById('fldSound').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldSound').parentElement.MaterialCheckbox.uncheck()

    if (remote.getGlobal('settings').notification) document.getElementById('fldNotification').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldNotification').parentElement.MaterialCheckbox.uncheck()

    document.getElementById('myWalletBurst').innerHTML = remote.getGlobal('settings').acDetailsBurst

    document.getElementById('acDetailsWallet').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsWallet)
    document.getElementById('acDetailsBurst').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsBurst)
    document.getElementById('acDetailsNumeric').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsNumeric)
    document.getElementById('acDetailsPendingJson').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsPendingJson)
}

module.exports = {

    getSettings: (updateFields = true) => {
        fsAccess.get('gui.conf', 'GUI settings operations done', true).then((data) => {
            if (data) {
                setValues(data, updateFields)

                if (updateFields) setFormsValues()
                else document.getElementById('myWalletBurst').innerHTML = remote.getGlobal('settings').acDetailsBurst
            }
        })
    },

    setSettings: () => {
        fsAccess.set('gui.conf', remote.getGlobal('settings'), 'GUI settings operations done', true)
    }

}