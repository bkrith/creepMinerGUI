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

const psTree = require('ps-tree')

module.exports = {
    
    kill: (pid, signal, callback) => {        
        signal   = signal || 'SIGTERM'
        callback = callback || function () {}
        let killTree = true
        if(killTree) {
            psTree(pid, (err, children) => {
                [pid].concat(
                    children.map((p) => {
                        return p.PID
                    })
                ).forEach((tpid) => {
                    try { process.kill(tpid, signal) }
                    catch (ex) { }
                })
                callback()
            });
        } else {
            try { process.kill(pid, signal) }
            catch (ex) { }
            callback()
        }
    },

    getPID: () => {
      return document.getElementById('pid').innerHTML
    }

}