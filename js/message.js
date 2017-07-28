
'use strict'


module.exports = {
    message: (icon, msg, section) => {
        let text = '<i class="material-icons">' + icon + '</i> ' + msg
        let d = new Date()
        let now = d.toTimeString()
        now = now.split(' ')[0] + ': '

        document.getElementById('logAreaDiv').innerHTML += now + section + ': ' + text + '<br>'
        switch(section) {
            case 'Miner':
                document.getElementById('statusMiner').innerHTML = text
                break
            case 'Wallet':
                document.getElementById('statusWallet').innerHTML = text
                break
            case 'Settings':
                document.getElementById('statusSettings').innerHTML = text
                break
            case 'General':
                document.getElementById('statusGeneral').innerHTML = text
                break
        }
    }
}