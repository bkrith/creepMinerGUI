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
