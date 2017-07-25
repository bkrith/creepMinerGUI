'use strict'

const { shell, remote } = require('electron')

require('chart.js')

let ws = null

let lastBlock = null
let thisBlockBest = null
let bestDeadlineOverall = null
let confirmedDeadlines = 0
let nowDlInfo = ''
let nowDlInfoSec = 0

let ctx = document.getElementById("myChart").getContext('2d')
let myChart = new Chart(ctx)

let newBlock = (block) => {
    if (!lastBlock) {
        lastBlock = 1
    }
    else if (block.block > lastBlock) {
        lastBlock = block.block
        
        nowDlInfo = ''
        nowDlInfoSec = 0

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

        getBlockRows(block.bestDeadlines)
        createChart(getBlockRows(block.bestDeadlines), getDeadlinesRows(block.bestDeadlines))

        document.getElementById('nowBlockInfo').innerHTML = '<strong>#' + block.block + '</strong>'
        
        setConfirmedDeadlines(block.deadlinesConfirmed)
        document.getElementById('wonBlocks').innerHTML = block.blocksWon
        document.getElementById('minedBlocks').innerHTML = block.blocksMined
        document.getElementById('averageDeadline').innerHTML = block.deadlinesAvg

        document.getElementById(`block_${block.block}`).scrollIntoView(false)

        document.getElementById('consoleAreaDiv').scrollIntoView(false)

        remote.getGlobal('share').lastBlock = `block_${block.block}`
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
    if (lastBlock > 1) {
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
            ${deadline.time}: <span class="spaceSpan">in ${deadline.plotfile}</span> <br>
            </span>
        `

        document.getElementById(`block_${lastBlock}`).scrollIntoView(false)
        
        document.getElementById('consoleAreaDiv').scrollIntoView(false)

        remote.getGlobal('share').lastBlock = `block_${lastBlock}`
    }
}

let addOrConfirm = (deadline) => {
    if (lastBlock > 1) {
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
        
        remote.getGlobal('share').lastBlock = `block_${lastBlock}`
    }
}

let addOrSubmit = (deadline) => {
    if (lastBlock > 1) {
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
    }
}

let checkAddBestRound = (deadlineNum, deadline) => {
    if (!thisBlockBest || thisBlockBest > deadlineNum) {
        thisBlockBest = deadlineNum
        document.getElementById('thisBlockBest').innerHTML = deadline
    }
}

let checkAddBestOverall = (deadlineNum, deadline) => {
    if (!bestDeadlineOverall || bestDeadlineOverall > deadlineNum) {
		bestDeadlineOverall = deadlineNum;
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
}

let lastWinner = (winner) => {
    let d = new Date();
    let now = d.toTimeString();
    now = now.split(' ')[0];

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
}

let wonBlock = (blocksWon) => {
    if (blocksWon) console.log(blocksWon);
}

let minerConsole = (type) => {
    if (type) console.log(type)
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
            }
        }
    });
}

let deadlineFormat = (val) => {
	var secs = Math.floor(val)
	var mins = Math.floor(secs / 60)
	var hours = Math.floor(mins / 60)
	var day = Math.floor(hours / 24)
	var months = Math.floor(day / 30)
	var years = Math.floor(months / 12)
	var msg = ""
	
	if (years > 0)
		msg += years.toFixed() + "y "
	if (months > 0)
		msg += (months % 12).toFixed() + "m "
	if (day > 0)
		msg += day % 30 + "d "
	msg += ("00" + (hours % 24)).slice(-2) + ':'
	msg += ("00" + (mins % 60)).slice(-2) + ':'
	msg += ("00" + (secs % 60)).slice(-2)

	return msg;
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

let connect = () => {
            if (ws) ws.close(3001)
        
            if (remote.getGlobal('conf').webserver.url) {
                ws = new WebSocket('ws://' + remote.getGlobal('conf').webserver.url.split('//')[1]) 
            }
            else {
                setTimeout(() => {
                    connect()
                }, 5000)

                return
            }

            ws.onopen = (event) => {
                let message = 'Connection with miner established!'

                console.log(message)
                
                document.getElementById('consoleAreaDiv').innerHTML += `
                    <span class="successText">
                    ${message} <br>
                    </span>
                `

                document.getElementById('startBtn').innerHTML = '<i class="material-icons">stop</i> Stop mining'

                document.getElementById('consoleAreaDiv').scrollIntoView(false)

                document.getElementById('footer').innerHTML = '<span><i class="material-icons">done</i> Miner is online</span>'
            }

            ws.onclose = (event) => {
                let message = 'Connection with miner closed'
                let colorText = 'successText'
                if (event.code != 3001) {
                    message = 'Something close the connection with error! Im trying to recconect..'
                    colorText = 'errorText'

                    setTimeout(() => {
                        connect()
                    }, 5000)
                }
                
                console.log(message)

                document.getElementById('consoleAreaDiv').innerHTML += `
                    <span class="${colorText}">
                    ${message} <br>
                    </span>
                `

                document.getElementById('startBtn').innerHTML = '<i class="material-icons">play_arrow</i> Start mining'

                document.getElementById('footer').innerHTML = '<span><i class="material-icons">error_outline</i> Miner is offline</span>'

                document.getElementById('consoleAreaDiv').scrollIntoView(false)

                ws = null
            }

            ws.onerror = (event) => {
                let message = 'Something goes wrong! Error: ' + event.type
                
                console.log(message)

                document.getElementById('consoleAreaDiv').innerHTML += `
                    <span class="errorText">
                    ${message} <br>
                    </span>
                `

                document.getElementById('consoleAreaDiv').scrollIntoView(false)

                document.getElementById('footer').innerHTML = '<span><i class="material-icons">error_outline</i> ' + message + '</span>'
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
                        default:
                            minerConsole(response.type)
                            break
                    }
                }
            }
    }


connect()