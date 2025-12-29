// ESP8266 Configuration
const ESP8266_BASE_URL = 'http://192.168.4.1';

// State
let isConnected = false;
let batteryLevel = 85;
let selectedEye = 1;
let selectedMode = 1;
let moveInterval = null;

// HTTP Request Helper
async function sendCommand(endpoint) {
    const url = `${ESP8266_BASE_URL}${endpoint}`;
    console.log(`Sending command: ${url}`);
    
    try {
        const response = await fetch(url, { 
            method: 'GET',
            mode: 'no-cors' // For ESP8266 without CORS
        });
        console.log(`Command sent successfully: ${endpoint}`);
        return true;
    } catch (error) {
        console.error(`Error sending command: ${error}`);
        return false;
    }
}

// Check Connection Status
async function checkStatus() {
    try {
        const response = await fetch(`${ESP8266_BASE_URL}/status`, {
            method: 'GET',
            timeout: 3000
        });
        const data = await response.json();
        
        isConnected = data.connected || false;
        batteryLevel = data.battery || 0;
        
        updateUI();
    } catch (error) {
        isConnected = false;
        updateUI();
        console.log('Connection check failed - using demo mode');
    }
}

// Update UI Elements
function updateUI() {
    const connectionIcon = document.getElementById('connectionIcon');
    const batteryPercentage = document.getElementById('batteryPercentage');
    
    // Connection Status - toggle chain link icon
    const chainConnected = connectionIcon.querySelector('.chain-connected');
    const chainDisconnected = connectionIcon.querySelector('.chain-disconnected');
    
    if (isConnected) {
        chainConnected.style.display = 'block';
        chainDisconnected.style.display = 'none';
        connectionIcon.setAttribute('title', 'Connected');
    } else {
        chainConnected.style.display = 'none';
        chainDisconnected.style.display = 'block';
        connectionIcon.setAttribute('title', 'Not Connected');
    }
    
    // Update battery percentage text
    if (batteryPercentage) {
        batteryPercentage.textContent = `${batteryLevel}%`;
    }
    
    // Battery level - show/hide bars based on percentage
    const batteryBars = document.querySelectorAll('.battery-indicator rect[x="4"], .battery-indicator rect[x="12"], .battery-indicator rect[x="20"]');
    
    if (batteryLevel > 66) {
        // Show all 3 bars
        batteryBars.forEach(bar => bar.style.display = 'block');
    } else if (batteryLevel > 33) {
        // Show 2 bars
        batteryBars[0].style.display = 'block';
        batteryBars[1].style.display = 'block';
        batteryBars[2].style.display = 'none';
    } else if (batteryLevel > 0) {
        // Show 1 bar
        batteryBars[0].style.display = 'block';
        batteryBars[1].style.display = 'none';
        batteryBars[2].style.display = 'none';
    } else {
        // Show no bars
        batteryBars.forEach(bar => bar.style.display = 'none');
    }
}

// Eyes Selector
document.querySelectorAll('.eye-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.eye-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        selectedEye = parseInt(this.dataset.eye);
        sendCommand(`/eyes${selectedEye}`);
    });
});

// Mode 1 Selector
document.getElementById('mode1Select').addEventListener('change', function() {
    sendCommand(`/mode1?value=${this.value}`);
});

// Mode 2 Selector
document.getElementById('mode2Select').addEventListener('change', function() {
    sendCommand(`/mode2?value=${this.value}`);
});

// Mode 3 Selector
document.getElementById('mode3Select').addEventListener('change', function() {
    sendCommand(`/mode3?value=${this.value}`);
});

// Direction Pad - Hold to Move
document.querySelectorAll('.dir-btn').forEach(btn => {
    let pressTimer = null;
    
    // Mouse events
    btn.addEventListener('mousedown', function() {
        const direction = this.dataset.dir;
        startMoving(direction);
    });
    
    btn.addEventListener('mouseup', stopMoving);
    btn.addEventListener('mouseleave', stopMoving);
    
    // Touch events for mobile
    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const direction = this.dataset.dir;
        startMoving(direction);
    });
    
    btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopMoving();
    });
});

function startMoving(direction) {
    // Send immediate command
    sendCommand(`/move?dir=${direction}`);
    
    // Continue sending while held
    moveInterval = setInterval(() => {
        sendCommand(`/move?dir=${direction}`);
    }, 150);
}

function stopMoving() {
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
    sendCommand(`/move?dir=stop`);
}

// Speed Slider
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');

speedRange.addEventListener('input', function() {
    speedValue.textContent = this.value;
});

speedRange.addEventListener('change', function() {
    sendCommand(`/speed?value=${this.value}`);
});

// Refresh Button
document.getElementById('refreshBtn').addEventListener('click', function() {
    checkStatus();
});

// Initialize
updateUI();

// Auto-check status every 5 seconds
setInterval(checkStatus, 5000);

// Demo mode - simulate connection for testing
setTimeout(() => {
    console.log('Running in demo mode - UI is fully functional');
    console.log('Update ESP8266_BASE_URL in script.js to connect to your device');
}, 1000);
