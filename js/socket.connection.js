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

const { shell, remote } = require('electron')
const msg               = require('./message.js')
const notifier          = require('node-notifier')
const path              = require('path')

require('chart.js')

let ws = null
let connectTimout = null
let normalClose = false

let lastBlock = null
let thisBlockBest = null
let bestDeadlineOverall = null
let confirmedDeadlines = 0
let nowDlInfo = ''
let nowDlInfoSec = 0

let blockTime = 0

let notifyInfo = {
    title: '',
    message: ''
}

let ctx = document.getElementById("myChart").getContext('2d')
let myChart = new Chart(ctx)

let confirmedSound = new Audio(__dirname + '/../sounds/sms-alert-1-daniel_simon.mp3')
confirmedSound.volume = 0.5

let newBlock = (block) => {
    //if (!lastBlock) {
        //lastBlock = 1
    //}
    //else 
    if (block.block > lastBlock) {
        lastBlock = block.block
        
        nowDlInfo = ''
        nowDlInfoSec = 0

        blockTime = block.time

        document.getElementById('nowDlInfo').innerHTML = '-'

        document.getElementById('minerArea').innerHTML += `
            <div class="blockCard" id="block_${block.block}">
                <div class="blockCardTitle">
                    <strong class="blockCardTitleNum"># ${block.block}</strong> <span class="right">${block.time}</span>
                </div>
                <div class="blockCardInfo">
                    scoop: ${block.scoop} <br>
                    baseTarget: ${block.baseTarget} <br>
                    genSignature: ${block.gensigStr} <br>
                    <div class="mdl-list" id="card-dlsAreaBlock_${block.block}"></div>
                </div>
            </div>
        `

        document.getElementById('nowBlock').innerHTML = `
            <div class="blockCard" id="block_${block.block}">
                <div class="blockCardTitle">
                    <strong class="blockCardTitleNum"># ${block.block}</strong> <span class="right">${block.time}</span>
                </div>
                <div class="blockCardInfo">
                    scoop: ${block.scoop} <br>
                    baseTarget: ${block.baseTarget} <br>
                    genSignature: ${block.gensigStr} <br>
                    <div class="mdl-list" id="card-dlsNowBlock_${block.block}"></div>
                </div>
            </div>
        `

        document.getElementById('consoleAreaDiv').innerHTML += `
            <span class="newText">
            ${block.time}: ----------------------------- <br>
            ${block.time}: block # ${block.block} <br>
            ${block.time}: scoop: ${block.scoop} <br>
            ${block.time}: baseTarget: ${block.baseTarget} <br>
            ${block.time}: genSignature: ${block.gensigStr} <br>
            ${block.time}: ----------------------------- <br>
            </span>
        `

        notifyInfo.title = 'Block #' + block.block
        notifyInfo.message = ''

        // getBlockRows(block.bestDeadlines)
        createChart(getBlockRows(block.bestDeadlines), getDeadlinesRows(block.bestDeadlines))

        document.getElementById('nowBlockInfo').innerHTML = '<strong>#' + block.block + '</strong>'
        
        setConfirmedDeadlines(block.deadlinesConfirmed)
        document.getElementById('wonBlocks').innerHTML = block.blocksWon
        document.getElementById('minedBlocks').innerHTML = block.blocksMined
        document.getElementById('averageDeadline').innerHTML = block.deadlinesAvg

        document.getElementById(`block_${block.block}`).scrollIntoView(false)

        document.getElementById('consoleAreaDiv').scrollIntoView(false)

        remote.getGlobal('share').lastBlock = `block_${block.block}`

        // msg.message('done', 'Mining new block: #' + block.block, 'Miner')

        if (remote.getGlobal('settings').sound) confirmedSound.play()
    }
}

let getBlockRows = (table) => {
    let blocks = []
    for (let i = 0; i < table.length; i++) {
        blocks.push(table[i][0])
    }
    return blocks
}

let getDeadlinesRows = (table) => {
    let deadlines = []
    for (let i = 0; i < table.length; i++) {
        deadlines.push(table[i][1])
    }
    return deadlines
}

let nonceFound = (deadline) => {
    // If is hack to stop duplicate nonce found
    if (!document.getElementById(`nonce_${deadline.nonce}`)) {
    //if (lastBlock > 1) {
        let timeDif = reverseTimeFormat(deadline.time) - reverseTimeFormat(blockTime)

        document.getElementById(`card-dlsAreaBlock_${lastBlock}`).innerHTML += `
            <div class="mdl-list__item warning" id="nonce_${deadline.nonce}">
                <span class="mdl-list__item-primary-content">
                    <i class="material-icons">find_in_page</i> 
                    <span><b>${deadline.account}</b>: nonce found (${deadline.deadline} - ${deadline.deadlineNum})</span>
                </span>
                <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
            </div>
        `

        document.getElementById(`card-dlsNowBlock_${lastBlock}`).innerHTML += `
            <div class="mdl-list__item warning" id="nowNonce_${deadline.nonce}">
                <span class="mdl-list__item-primary-content">
                    <i class="material-icons">find_in_page</i> 
                    <span><b>${deadline.account}</b>: nonce found (${deadline.deadline} - ${deadline.deadlineNum})</span>
                </span>
                <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
            </div>
        `

        document.getElementById('consoleAreaDiv').innerHTML += `
            <span class="warningText">
            ${deadline.time}: ${deadline.account}: nonce found (${deadline.deadline} - ${deadline.deadlineNum}) <br>
            ${deadline.time}: <span class="spaceSpan">nonce: ${deadline.nonce}</span> <br>
            ${deadline.time}: <span class="spaceSpan">in ${deadline.plotfile} </span> <br>
            </span>
            <span class="newText">
            ${deadline.time}: <span class="spaceSpan">${deadline.plotfile} read in ${timeDif}s </span> <br>
            </span>
        `

        document.getElementById(`block_${lastBlock}`).scrollIntoView(false)
        
        document.getElementById('consoleAreaDiv').scrollIntoView(false)

        remote.getGlobal('share').lastBlock = `block_${lastBlock}`
    //}
    }
}

let addOrConfirm = (deadline) => {
    //if (lastBlock > 1) {
        if (nowDlInfoSec == 0 || nowDlInfoSec > deadline.deadlineNum) {
            nowDlInfo = deadline.deadline
            nowDlInfoSec = deadline.deadlineNum

            document.getElementById('nowDlInfo').innerHTML = deadline.deadline
        }

        document.getElementById(`nonce_${deadline.nonce}`).classList.remove('warning')
        document.getElementById(`nonce_${deadline.nonce}`).classList.remove('info')
        document.getElementById(`nonce_${deadline.nonce}`).classList.add('success')
        document.getElementById(`nonce_${deadline.nonce}`).innerHTML = `
            <span class="mdl-list__item-primary-content">
                <i class="material-icons">done</i> 
                <span><b>${deadline.account}</b>: nonce confirmed (${deadline.deadline} - ${deadline.deadlineNum})</span>
            </span>
            <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
        `

        document.getElementById(`nowNonce_${deadline.nonce}`).classList.remove('warning')
        document.getElementById(`nowNonce_${deadline.nonce}`).classList.remove('info')
        document.getElementById(`nowNonce_${deadline.nonce}`).classList.add('success')
        document.getElementById(`nowNonce_${deadline.nonce}`).innerHTML = `
            <span class="mdl-list__item-primary-content">
                <i class="material-icons">done</i> 
                <span><b>${deadline.account}</b>: nonce confirmed (${deadline.deadline} - ${deadline.deadlineNum})</span>
            </span>
            <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
        `

        document.getElementById(`block_${lastBlock}`).scrollIntoView(false)

        document.getElementById('consoleAreaDiv').scrollIntoView(false)
        
        document.getElementById('consoleAreaDiv').innerHTML += `
            <span class="successText">
            ${deadline.time}: ${deadline.account}: nonce confirmed (${deadline.deadline} - ${deadline.deadlineNum}) <br>
            ${deadline.time}: <span class="spaceSpan">nonce: ${deadline.nonce}</span> <br>
            ${deadline.time}: <span class="spaceSpan">in ${deadline.plotfile}</span> <br>
            </span>
        `

        notifyInfo.message += 'Nonce confirmed ' + deadline.deadline + ' - ' + deadline.deadlineNum + '\n'
        
        remote.getGlobal('share').lastBlock = `block_${lastBlock}`
    //}
}

let addOrSubmit = (deadline) => {
    //if (lastBlock > 1) {
        document.getElementById(`nonce_${deadline.nonce}`).classList.remove('warning')
        document.getElementById(`nonce_${deadline.nonce}`).classList.add('info')
        document.getElementById(`nonce_${deadline.nonce}`).innerHTML = `
            <span class="mdl-list__item-primary-content">
                <i class="material-icons">keyboard_arrow_right</i> 
                <span><b>${deadline.account}</b>: nonce submitted (${deadline.deadline} - ${deadline.deadlineNum})</span>
            </span>
            <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
        `

        document.getElementById(`nowNonce_${deadline.nonce}`).classList.remove('warning')
        document.getElementById(`nowNonce_${deadline.nonce}`).classList.add('info')
        document.getElementById(`nowNonce_${deadline.nonce}`).innerHTML = `
            <span class="mdl-list__item-primary-content">
                <i class="material-icons">keyboard_arrow_right</i> 
                <span><b>${deadline.account}</b>: nonce submitted (${deadline.deadline} - ${deadline.deadlineNum})</span>
            </span>
            <span class="mdl-list__item-secondary-action" style="float:right">${deadline.time}</span>
        `

        document.getElementById(`block_${lastBlock}`).scrollIntoView(false)

        document.getElementById('consoleAreaDiv').scrollIntoView(false)

        document.getElementById('consoleAreaDiv').innerHTML += `
            <span class="infoText">
            ${deadline.time}: ${deadline.account}: nonce submitted (${deadline.deadline} - ${deadline.deadlineNum}) <br>
            ${deadline.time}: <span class="spaceSpan">nonce: ${deadline.nonce}</span> <br>
            ${deadline.time}: <span class="spaceSpan">in ${deadline.plotfile}</span> <br>
            </span>
        `
        
        remote.getGlobal('share').lastBlock = `block_${lastBlock}`
    //}
}

let checkAddBestRound = (deadlineNum, deadline) => {
    if (!thisBlockBest || thisBlockBest > deadlineNum) {
        thisBlockBest = deadlineNum
        document.getElementById('thisBlockBest').innerHTML = deadline
    }
}

let checkAddBestOverall = (deadlineNum, deadline) => {
    if (!bestDeadlineOverall || bestDeadlineOverall > deadlineNum) {
		bestDeadlineOverall = deadlineNum
		document.getElementById('bestDeadlineOverall').innerHTML = deadline
	}
}

let setConfirmedDeadlines = (deadlines) => {
    confirmedDeadlines = deadlines
    document.getElementById('confirmedDeadlines').innerHTML = deadlines
}

let config = (cfg) => {

    document.getElementById('poolUrl').innerHTML = `<a href="#" onclick="require('electron').shell.openExternal('${cfg.poolUrl}')">${cfg.poolUrl}</a>`
    document.getElementById('miningUrl').innerHTML = `<a href="#" onclick="require('electron').shell.openExternal('${cfg.miningInfoUrl}')">${cfg.miningInfoUrl}</a>`
    document.getElementById('walletUrl').innerHTML = `<a href="#" onclick="require('electron').shell.openExternal('${cfg.walletUrl}')">${cfg.walletUrl}</a>`
    document.getElementById('plotSize').innerHTML = cfg.totalPlotSize
    document.getElementById('bufferSize').innerHTML = cfg.bufferSize
    document.getElementById('targetDeadline').innerHTML = cfg.targetDeadline
    document.getElementById('plotReaders').innerHTML = cfg.maxPlotReaders
    document.getElementById('miningIntensity').innerHTML = cfg.miningIntensity
    document.getElementById('submissionRetry').innerHTML = cfg.submissionMaxRetry
    
}

let setProgress = (percentage = null) => {
    if (percentage) document.getElementById('progressBar').MaterialProgress.setProgress(percentage)
    if (percentage == 100 && remote.getGlobal('settings').notification) {
        if (notifyInfo.message == '') notifyInfo.message = 'No deadlines'
        notifier.notify({
            title: notifyInfo.title,
            message: notifyInfo.message,
            icon: path.join(__dirname, '/../block.png'),
            sound: true,
            wait: false
        })
    }
}

let lastWinner = (winner) => {
    //if (lastBlock > 1) {
        let d = new Date()
        let now = d.toTimeString()
        now = now.split(' ')[0]

        document.getElementById('winnersArea').innerHTML += `
            <div class="blockCard">
                <div class="blockCardTitle">
                    <strong class="blockCardTitleNum"># ${lastBlock - 1}</strong> <span class="right">${now}</span>
                </div>
                <div class="blockCardInfo" id="winner_${lastBlock - 1}">
                    Name : ${winner.name} <br>
                    Numeric : ${winner.numeric} <br>
                    Address : <a href="#" onclick="require('electron').shell.openExternal('https://block.burstcoin.info/acc.php?acc=BURST-${winner.address}')">BURST-${winner.address}</a>
                </div>
            </div>
        `

        document.getElementById(`winner_${lastBlock - 1}`).scrollIntoView(false)

        document.getElementById('consoleAreaDiv').innerHTML += `
                <span class="newText">
                ${now}: ----------------------------- <br>
                ${now}: last block winner <br>
                ${now}: block # ${lastBlock - 1} <br>
                ${now}: winner-numeric: ${winner.numeric} <br>
                ${now}: winner-address: <a href="#" onclick="require('electron').shell.openExternal('https://block.burstcoin.info/acc.php?acc=BURST-${winner.address}')">${winner.address}</a> <br>
                ${now}: winner-name: ${winner.name} <br>
                ${now}: ----------------------------- <br>
                </span>
            `
        
        document.getElementById('consoleAreaDiv').scrollIntoView(false)
            
        remote.getGlobal('share').lastWinner = `winner_${lastBlock - 1}`
    //}
}

let wonBlock = (blocksWon) => {
    if (blocksWon) console.log(blocksWon)
}

let minerConsole = (data) => {
    if (data) msg.message('warning', JSON.stringify(data), 'Miner')
}

let createChart = (blocks, deadlines) => {
    if (myChart) myChart.destroy()
        
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: blocks,
            datasets: [{
                label: 'Deadline',
                lineTension: 0,
                data: deadlines,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return deadlineFormat(value)
                        }
                    }
                }]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                displayColors: false,
                callbacks: {
                    label: function(tooltipItem, data) {
                        let label = data.labels[tooltipItem.index]
                        let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                        return 'Deadline: ' + deadlineFormat(parseInt(datasetLabel)) 
                    },
                    title: function(tooltipItem, data) {
                        return 'Block #' + tooltipItem[0].xLabel
                    }
                }
            }
        }
    })
}

let deadlineFormat = (val) => {
	let secs = Math.floor(val)
	let mins = Math.floor(secs / 60)
	let hours = Math.floor(mins / 60)
	let day = Math.floor(hours / 24)
	let months = Math.floor(day / 30)
	let years = Math.floor(months / 12)
	let msg = ""
	
	if (years > 0)
		msg += years.toFixed() + "y "
	if (months > 0)
		msg += (months % 12).toFixed() + "m "
	if (day > 0)
		msg += day % 30 + "d "
	msg += ("00" + (hours % 24)).slice(-2) + ':'
	msg += ("00" + (mins % 60)).slice(-2) + ':'
	msg += ("00" + (secs % 60)).slice(-2)

	return msg
}

let reverseTimeFormat = (val) => {
    let units = val.split(' ')
    let years = 0
    let months = 0
    let days = 0
    let mixedTime = 0
    let seconds = 0

    for (let i = 0; i < units.length; i++) {
        if (units[i].match('y')) {
            years = parseInt(units[i].substr(0, units[0].length - 1))
        }
        else if (units[i].match('m')) {
            months = parseInt(units[i].substr(0, units[0].length - 1))
        }
        else if (units[i].match('d')) {
            days = parseInt(units[i].substr(0, units[0].length - 1))
        }
        else if (units[i].match(':')) {
            mixedTime = units[i].split(':')
        }
    }

    days += years * 365
    days += months * 30
    seconds += days * 24 * 60 * 60
    seconds += parseInt(mixedTime[0]) * 60 * 60
    seconds += parseInt(mixedTime[1]) * 60
    seconds += parseInt(mixedTime[2])

    return seconds
}

let clearAreas = () => {
    remote.getGlobal('share').lastBlock = ''
    remote.getGlobal('share').lastWinner = ''
    document.getElementById('minerArea').innerHTML = '<span></span>'
    
    document.getElementById('consoleAreaDiv').innerHTML = '<span></span>'

    document.getElementById('logAreaDiv').innerHTML = '<span></span>'
    
    document.getElementById('winnersArea').innerHTML = '<span></span>'
}

let connect = () => {
            let wsUrl = null

            if (ws) {
                ws.close()
                clearAreas()
            }
        
            if (remote.getGlobal('share').connectType) {
                wsUrl = remote.getGlobal('share').connectType
            }
            else {
                wsUrl = 'ws://' + remote.getGlobal('conf').webserver.url.split('//')[1]
            }

            ws = new WebSocket(wsUrl)

            /*
            else {
                setTimeout(() => {
                    connect()
                }, 5000)

                return
            }
            */

            ws.onopen = (event) => {
                lastBlock = null
                thisBlockBest = null
                bestDeadlineOverall = null
                confirmedDeadlines = 0
                nowDlInfo = ''
                nowDlInfoSec = 0
                blockTime = 0

                let message = 'Connection with miner established!'

                console.log(message)
                
                document.getElementById('consoleAreaDiv').innerHTML += `
                    <span class="successText">
                    ${message} <br>
                    </span>
                `

                document.getElementById('consoleAreaDiv').scrollIntoView(false)

                msg.message('done', 'Miner is online', 'Miner')
            }

            ws.onclose = (event) => {
                let message = 'Connection with miner closed'
                let colorText = 'successText'
                
                if (!normalClose) {
                    message = 'Something close the connection with error! Im trying to recconect..'
                    colorText = 'errorText'

                    connectTimout = setTimeout(() => {
                        if (!normalClose) {
                            connect()
                        }
                        else {
                            normalClose = false
                            clearTimeout(connectTimout)
                        }
                    }, 5000)
                }
                else {
                    normalClose = false
                    message = 'Miner is offline'
                    colorText = 'errorText'
                    clearTimeout(connectTimout)
                    clearAreas()
                    ws = null
                }

                if (normalClose) {
                    clearTimeout(connectTimout)
                }
                
                console.log(message)

                msg.message('warning', message, 'Miner')
            }

            ws.onerror = (event) => {
                let message = 'Something goes wrong! Error: ' + event.type
                
                console.log(message)

                msg.message('warning', message, 'Miner')

                clearAreas()
            }

            ws.onmessage = (message) => {
                let data = message.data
		
                if (data)
                {
                    let response = JSON.parse(data)
                    
                    switch (response.type)
                    {
                        case 'new block':
                            newBlock(response)
                            break
                        case 'nonce found':
                            nonceFound(response)
                            break
                        case 'nonce confirmed':
                            addOrConfirm(response)
                            checkAddBestRound(response.deadlineNum, response.deadline)
                            checkAddBestOverall(response.deadlineNum, response.deadline)
                            break
                        case 'nonce submitted':
                            addOrSubmit(response)
                            break
                        case 'config':
                            config(response)
                            break
                        case 'progress':
                            setProgress(response.value)
                            break
                        case 'lastWinner':
                            lastWinner(response)
                            break
                        case 'blocksWonUpdate':
                            wonBlock(reponse.blocksWon)
                            break
                        case 1:
                            minerConsole(response)
                            break
                        case 2:
                            minerConsole(response)
                            break
                        case 3:
                            minerConsole(response)
                            break
                        case 4:
                            minerConsole(response)
                            break
                        case 5:
                            minerConsole(response)
                            break
                        case 6:
                            minerConsole(response)
                            break
                        case 7:
                            minerConsole(response)
                            break
                        case 8:
                            minerConsole(response)
                            break
                        default:
                            minerConsole(response)
                            break
                    }
                }
            }
    }

module.exports = {
    
    startWs: () => {
        connect()
    },

    stopWs: () => {
        console.log('Normal close')
        if (ws) {
            normalClose = true
            ws.close()
        }
    }

}
