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

const remote    = require('electron').remote
const fs        = require('fs')
const fsAccess  = require('../fs.access.js')

let setValues = (data) => {
    remote.getGlobal('conf').logging.config = data.logging.config
    remote.getGlobal('conf').logging.general = data.logging.general
    remote.getGlobal('conf').logging.miner = data.logging.miner
    remote.getGlobal('conf').logging.path = data.logging.path
    remote.getGlobal('conf').logging.plotReader = data.logging.plotReader
    remote.getGlobal('conf').logging.plotVerifier = data.logging.plotVerifier
    remote.getGlobal('conf').logging.server = data.logging.server
    remote.getGlobal('conf').logging.session = data.logging.session
    remote.getGlobal('conf').logging.socket = data.logging.socket
    remote.getGlobal('conf').logging.wallet = data.logging.wallet
    remote.getGlobal('conf').logging.nonceSubmitter = data.logging.nonceSubmitter
    remote.getGlobal('conf').logging.output.dirDone = data.logging.output.dirDone
    remote.getGlobal('conf').logging.output.lastWinner = data.logging.output.lastWinner
    remote.getGlobal('conf').logging.output.nonceConfirmed = data.logging.output.nonceConfirmed
    remote.getGlobal('conf').logging.output.nonceFound = data.logging.output.nonceFound
    remote.getGlobal('conf').logging.output.nonceOnTheWay = data.logging.output.nonceOnTheWay
    remote.getGlobal('conf').logging.output.nonceSent = data.logging.output.nonceSent
    remote.getGlobal('conf').logging.output.plotDone = data.logging.output.plotDone
    remote.getGlobal('conf').mining.intensity = parseInt(data.mining.intensity)
    remote.getGlobal('conf').mining.maxBufferSizeMB = parseInt(data.mining.maxBufferSizeMB)
    remote.getGlobal('conf').mining.maxPlotReaders = parseInt(data.mining.maxPlotReaders)
    remote.getGlobal('conf').mining.plots = data.mining.plots
    remote.getGlobal('conf').mining.submissionMaxRetry = parseInt(data.mining.submissionMaxRetry)
    remote.getGlobal('conf').mining.targetDeadline = data.mining.targetDeadline
    remote.getGlobal('conf').mining.timeout = parseInt(data.mining.timeout)
    remote.getGlobal('conf').mining.walletRequestRetryWaitTime = parseInt(data.mining.walletRequestRetryWaitTime)
    remote.getGlobal('conf').mining.walletRequestTries = parseInt(data.mining.walletRequestTries)
    remote.getGlobal('conf').mining.passphrase.algorithm = data.mining.passphrase.algorithm
    remote.getGlobal('conf').mining.passphrase.decrypted = data.mining.passphrase.decrypted
    remote.getGlobal('conf').mining.passphrase.deleteKey = data.mining.passphrase.deleteKey
    remote.getGlobal('conf').mining.passphrase.encrypted = data.mining.passphrase.encrypted
    remote.getGlobal('conf').mining.passphrase.iterations = parseInt(data.mining.passphrase.iterations)
    remote.getGlobal('conf').mining.passphrase.key = data.mining.passphrase.key
    remote.getGlobal('conf').mining.passphrase.salt = data.mining.passphrase.salt
    remote.getGlobal('conf').mining.urls.miningInfo = data.mining.urls.miningInfo
    remote.getGlobal('conf').mining.urls.submission = data.mining.urls.submission
    remote.getGlobal('conf').mining.urls.wallet = data.mining.urls.wallet
    remote.getGlobal('conf').webserver.start = data.webserver.start
    remote.getGlobal('conf').webserver.url = data.webserver.url
    remote.getGlobal('conf').webserver.credentials['hashed-pass'] = data.webserver.credentials['hashed-pass']
    remote.getGlobal('conf').webserver.credentials['hashed-user'] = data.webserver.credentials['hashed-user']
    remote.getGlobal('conf').webserver.credentials['plain-pass'] = data.webserver.credentials['plain-pass']
    remote.getGlobal('conf').webserver.credentials['plain-user'] = data.webserver.credentials['plain-user']
}

let setConfFormsValues = () => {
    let wsUrlTemp = remote.getGlobal('conf').webserver.url.split('//')[1]
    if (remote.getGlobal('conf').webserver.url) wsUrlTemp = remote.getGlobal('conf').webserver.url.split('//')[1]
    document.getElementById('fldWsUrl').parentElement.MaterialTextfield.change('ws://' + wsUrlTemp)
    
    document.getElementById('fldConfig').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.config)
    document.getElementById('fldGeneral').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.general)
    document.getElementById('fldMiner').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.miner)
    document.getElementById('fldNonceSubmitter').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.nonceSubmitter)
    document.getElementById('fldPath').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.path)
    document.getElementById('fldPlotReader').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.plotReader)
    document.getElementById('fldPlotVerifier').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.plotVerifier)
    document.getElementById('fldServer').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.server)
    document.getElementById('fldSession').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.session)
    document.getElementById('fldSocket').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.socket)
    document.getElementById('fldWallet').parentElement.MaterialTextfield.change(remote.getGlobal('conf').logging.wallet)
    if (remote.getGlobal('conf').logging.output.dirDone) document.getElementById('fldDirDone').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldDirDone').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.lastWinner) document.getElementById('fldLastWinner').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldLastWinner').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.nonceConfirmed) document.getElementById('fldNonceConfirmed').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldNonceConfirmed').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.nonceFound) document.getElementById('fldNonceFound').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldNonceFound').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.nonceOnTheWay) document.getElementById('fldNonceOnTheWay').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldNonceOnTheWay').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.nonceSent) document.getElementById('fldNonceSent').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldNonceSent').parentElement.MaterialCheckbox.uncheck()
    if (remote.getGlobal('conf').logging.output.plotDone) document.getElementById('fldPlotDone').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldPlotDone').parentElement.MaterialCheckbox.uncheck()
    document.getElementById('fldIntensity').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.intensity.toString())
    document.getElementById('fldMaxBufferSizeMB').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.maxBufferSizeMB.toString())
    document.getElementById('fldMaxPlotReaders').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.maxPlotReaders.toString())
    document.getElementById('fldSubmissionMaxRetry').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.submissionMaxRetry.toString())
    document.getElementById('fldTargetDeadline').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.targetDeadline)
    document.getElementById('fldTimeout').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.timeout.toString())
    document.getElementById('fldWalletRequestRetryWaitTime').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.walletRequestRetryWaitTime.toString())
    document.getElementById('fldWalletRequestTries').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.walletRequestTries.toString())
    let plotsS = ''
    for (let i = 0; i < remote.getGlobal('conf').mining.plots.length; i++) {
        if (remote.getGlobal('conf').mining.plots[i].trim().length > 0) plotsS += remote.getGlobal('conf').mining.plots[i] + '\n'
    }
    document.getElementById('fdlPlots').parentElement.MaterialTextfield.change(plotsS)
    document.getElementById('fldAlgorithm').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.algorithm)
    document.getElementById('fldDecrypted').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.decrypted)
    if (remote.getGlobal('conf').mining.passphrase.deleteKey) document.getElementById('fldDeleteKey').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldDeleteKey').parentElement.MaterialCheckbox.uncheck()
    document.getElementById('fldEncrypted').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.encrypted)
    document.getElementById('fldIterations').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.iterations.toString())
    document.getElementById('fldKey').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.key)
    document.getElementById('fldSalt').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.passphrase.salt)
    document.getElementById('fldMiningInfo').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.urls.miningInfo)
    document.getElementById('fldSubmission').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.urls.submission)
    document.getElementById('fldUrlsWallet').parentElement.MaterialTextfield.change(remote.getGlobal('conf').mining.urls.wallet)
    if (remote.getGlobal('conf').webserver.start) document.getElementById('fldStart').parentElement.MaterialCheckbox.check()
    else document.getElementById('fldStart').parentElement.MaterialCheckbox.uncheck()
    document.getElementById('fldUrl').parentElement.MaterialTextfield.change(remote.getGlobal('conf').webserver.url)
    document.getElementById('fldHashedPass').parentElement.MaterialTextfield.change(remote.getGlobal('conf').webserver.credentials['hashed-pass'])
    document.getElementById('fldHashedUser').parentElement.MaterialTextfield.change(remote.getGlobal('conf').webserver.credentials['hashed-user'])
    document.getElementById('fldPlainPass').parentElement.MaterialTextfield.change(remote.getGlobal('conf').webserver.credentials['plain-pass'])
    document.getElementById('fldPlainUser').parentElement.MaterialTextfield.change(remote.getGlobal('conf').webserver.credentials['plain-user'])
}

module.exports = {

    getConf: (updateFields = true) => {
        let confFile = remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("/")) + '/mining.conf'
        if (remote.getGlobal('share').platform == 'win32') {
			confFile = remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("\\")) + '\\mining.conf'
        }

        fsAccess.get(confFile, 'Miner settings operations done', false).then((data) => {
            if (data) {
                setValues(data)
                if (updateFields) setConfFormsValues()
            }
        })
    },

    setConf: () => {    
        let confFile = remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("/")) + '/mining.conf'
    	if (remote.getGlobal('share').platform == 'win32') {
			confFile = remote.getGlobal('settings').minerPath.substring(0, remote.getGlobal('settings').minerPath.lastIndexOf("\\")) + '\\mining.conf'
        }

        fsAccess.set(confFile, remote.getGlobal('conf'), 'Miner settings operations done', false)
    }

}
