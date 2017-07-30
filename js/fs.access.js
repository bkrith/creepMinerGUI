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