'use strinct'

const remote    = require('electron').remote
const acDetails = require('../account.details.js')
const fs        = require('fs')

const confSettings = require('./mining.conf.js')

let setValues = (data) => {
    remote.getGlobal('settings').minerPath = data.minerPath
    remote.getGlobal('settings').acDetailsWallet = data.acDetailsWallet
    remote.getGlobal('settings').acDetailsBurst = data.acDetailsBurst
    remote.getGlobal('settings').acDetailsNumeric = data.acDetailsNumeric
    remote.getGlobal('settings').acDetailsPendingJson = data.acDetailsPendingJson

    setFormsValues()
    
    acDetails.fetchAcDetailsOnceOnly()

    confSettings.getConf()
}

let setFormsValues = () => {
    if (remote.getGlobal('settings').minerPath) {
        document.getElementById('fldMinerPath').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
        document.getElementById('fldMinerPathModal').parentElement.MaterialTextfield.change(remote.getGlobal('settings').minerPath)
    }

    document.getElementById('acDetailsWallet').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsWallet)
    document.getElementById('acDetailsBurst').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsBurst)
    document.getElementById('acDetailsNumeric').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsNumeric)
    document.getElementById('acDetailsPendingJson').parentElement.MaterialTextfield.change(remote.getGlobal('settings').acDetailsPendingJson)
}

module.exports = {

    getSettings: () => {
        try {
            //test to see if settings exist
            fs.open('appSettings.json', 'r', (err, fd) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        fs.writeFile('appSettings.json', JSON.stringify(remote.getGlobal('settings'), null, 4), (err) => {
                            console.log(err)
                        })
                        return
                    }
                    else {
                        console.log(err)
                    }
                }
                
                fs.readFile('appSettings.json', (err, data) => {
                    if (err) console.log(err)
                    setValues(JSON.parse(data))
                })
            });
        } catch (err) {
            //if error, then there was no settings file (first run).
            console.log(err)
        }
    },

    setSettings: () => {
        try {
            //test to see if settings exist
            fs.open('appSettings.json', 'r', (err, fd) => {
                if (err) {
                    console.log(err)
                }
                
                fs.writeFile('appSettings.json', JSON.stringify(remote.getGlobal('settings'), null, 4), (err) => {
                    if (err) console.log(err)
                    
                    remote.getGlobal('share').restart = false

                    acDetails.fetchAcDetailsOnce()

                })
            });
        } catch (err) {
            //if error, then there was no settings file (first run).
            console.log(err)
        }
    }

}