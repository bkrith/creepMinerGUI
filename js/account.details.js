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

const remote    = require('electron').remote
const msg       = require('./message.js')

let fetchOnly = false

// let market = 'http://api.coinmarketcap.com/v1/ticker/burst/?convert=EUR'

let addPeriodOfThousands = (str) => {
    let start = str.length - 3
    let end = str.length
    let start2 = str.length - 6
    let start3 = str.length - 9

    let tempStr = ''

    if (start > 0) {
        if (start2 <= 0) start2 = 0
        tempStr = str.slice(start2, start) + "'" + str.slice(start, end)
        
        if (start2 > 0) {
            if (start3 <= 0) start3 = 0
            tempStr = str.slice(start3, start2) + "'" + tempStr

            return tempStr
        }
        else {
            return tempStr
        }
    }
    else {
        return str
    }
}

let fetchAccountDetails = () => {
    let wallet = remote.getGlobal('settings').acDetailsWallet
    let walletParms = '/burst?requestType=getGuaranteedBalance&account='
    let walletAccount = remote.getGlobal('settings').acDetailsBurst
    let numericAccount = remote.getGlobal('settings').acDetailsNumeric

    let poolPendingJson = remote.getGlobal('settings').acDetailsPendingJson

    msg.message('autorenew', 'Wallet refreshing...', 'Wallet')

    if (wallet && walletAccount && numericAccount && poolPendingJson) {
        fetch(wallet + walletParms + walletAccount)
            .then(res => res.json())
            .then(acc => {
                fetch(poolPendingJson)
                    .then(res => res.json())
                    .then(pend => {
                        let pendingAmount = pend.pendingPaymentList[numericAccount] || '0.00000000'
                        let accountBalance = acc.guaranteedBalanceNQT/100000000 || '0.00000000'
                        
                        document.getElementById('balanceMainNum').innerHTML = addPeriodOfThousands(accountBalance.toString().split('.')[0])
                        document.getElementById('balanceDecNum').innerHTML = accountBalance.toString().split('.')[1]

                        document.getElementById('pendingMainNum').innerHTML = addPeriodOfThousands(pendingAmount.toString().split('.')[0])
                        document.getElementById('pendingDecNum').innerHTML = pendingAmount.toString().split('.')[1].substr(0, 8)
                        
                        msg.message('done', 'Wallet ok', 'Wallet')

                        document.getElementById('renewWalletInfo').classList.remove('hide')
                    })
                    .catch(err => {
                        console.log(err)
                        msg.message('warning', err, 'Wallet')
                        document.getElementById('renewWalletInfo').classList.remove('hide')
                    })
            })
            .catch(err => {
                console.log(err)
                msg.message('warning', err, 'Wallet')
                document.getElementById('renewWalletInfo').classList.remove('hide')
            })
    }
}

module.exports = {

    fetchAcDetails: () => {
        setInterval(() => {
            fetchAccountDetails()
        }, 1000 * 60 * 5) // Fetch every 5 minutes
    },

    fetchAcDetailsOnce: () => {
        fetchAccountDetails()
    },

    fetchAcDetailsOnceOnly: () => {
        if (!fetchOnly) {
            fetchAccountDetails()
            fetchOnly = true
        }
    }

}
