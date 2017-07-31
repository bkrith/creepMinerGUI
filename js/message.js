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


module.exports = {
    message: (icon, msg, section, status = true) => {
        if (msg) {
            let text = '<i class="material-icons">' + icon + '</i> ' + msg
            let d = new Date()
            let now = d.toTimeString()
            now = now.split(' ')[0] + ': '

            document.getElementById('logAreaDiv').innerHTML += now + section + ': ' + text + '<br>'
            
            if (status) {
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
    }
}