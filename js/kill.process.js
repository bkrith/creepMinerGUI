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