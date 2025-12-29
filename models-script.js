// ESP8266 Configuration
const ESP8266_BASE_URL = 'http://192.168.4.1';

// State
let isConnected = false;
let batteryLevel = 85;

// HTTP Request Helper
async function sendCommand(endpoint) {
    const url = `${ESP8266_BASE_URL}${endpoint}`;
    console.log(`Sending command: ${url}`);
    
    try {
        const response = await fetch(url, { 
            method: 'GET',
            mode: 'no-cors'
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

// Model Card Click Handler
document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', function() {
        const modelName = this.dataset.model;
        
        // Remove active state from all cards
        document.querySelectorAll('.model-card').forEach(c => {
            c.style.background = '#2A2F4A';
        });
        
        // Add active state to clicked card
        this.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 102, 255, 0.2))';
        
        // Send HTTP command
        sendCommand(`/select_model?name=${encodeURIComponent(modelName)}`);
        
        console.log(`Selected model: ${modelName}`);
    });
});

// Refresh Button
document.getElementById('refreshBtn').addEventListener('click', function() {
    checkStatus();
});

// Initialize
updateUI();

// Auto-check status every 5 seconds
setInterval(checkStatus, 5000);

// Demo mode message
setTimeout(() => {
    console.log('Running in demo mode - UI is fully functional');
    console.log('Update ESP8266_BASE_URL in models-script.js to connect to your device');
}, 1000);
