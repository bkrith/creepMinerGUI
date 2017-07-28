
'use strict'

const fs        = require('mz/fs')
const remote    = require('electron').remote
const acDetails = require('./account.details.js')
const msg       = require('./message.js')


let getFile = (file, successMsg, refreshWallet) => {
    return fs.open(file, 'r').then((fd) => {
        return fs.readFile(file, 'utf8').then((data) => {
            msg.message('done', successMsg, 'Settings')
            return JSON.parse(data)
        })
        .catch((err) => {
            console.log(err)
            msg.message('warning', err, 'Settings')
            return err
        })
    })
    .catch((err) => {
        console.log(err)
        msg.message('warning', err, 'Settings')
        return err
    })
}

let setFile = (file, settings, successMsg, refreshWallet) => {
    fs.open(file, 'r').then((fd) => {
        fs.writeFile(file, JSON.stringify(settings, null, 4))
        .then((data) => {
            remote.getGlobal('share').restart = false

            if (refreshWallet) acDetails.fetchAcDetailsOnce()

            msg.message('done', successMsg, 'Settings')
        })
        .catch((err) => {
            console.log(err)
            msg.message('warning', err, 'Settings')
        })
    })
    .catch((err) => {
        if (err.code === 'ENOENT') {
            fs.writeFile(file, JSON.stringify(settings, null, 4))
            .then((data) => {
                remote.getGlobal('share').restart = false

                if (refreshWallet) acDetails.fetchAcDetailsOnce()

                msg.message('done', successMsg, 'Settings')
            })
            .catch((err) => {
                console.log(err)
                msg.message('warning', err, 'Settings')
            })
        }
        else {
            console.log(err)
            msg.message('warning', err, 'Settings')
            return err
        }
    })
}

let backupMining = (file) => {
    getFile(file, 'Mining.conf backup...', false).then((data) => {
        setFile('mining.conf.bak', data, 'Mining.conf backup done', false)
    })
}

let restoreMining = (file) => {
    getFile('mining.conf.bak', 'Mining.conf restore...', false).then((data) => {
        setFile(file, data, 'Mining.conf restore done', false)
    })
}


module.exports = {

    get: (file, successMsg, refreshWallet) => getFile(file, successMsg, refreshWallet),

    set: (file, successMsg, refreshWallet) => setFile(file, successMsg, refreshWallet),

    backupMiningConf: (file) => backupMining(file),

    restoreMiningConf: (file) => restoreMining(file)

}