// ESP8266 Configuration
const ESP8266_BASE_URL = 'http://192.168.4.1';

// State
let isConnected = false;
let batteryLevel = 85;

// HTTP Request Helper
async function sendCommand(endpoint) {
    const url = `${ESP8266_BASE_URL}${endpoint}`;
    console.log(`🚀 Sending command: ${url}`);
    
    try {
        const response = await fetch(url, { 
            method: 'GET',
            mode: 'no-cors'
        });
        console.log(`✓ Command sent successfully: ${endpoint}`);
        return true;
    } catch (error) {
        console.error(`✗ Error sending command: ${error}`);
        return false;
    }
}

// Check Connection Status
async function checkStatus() {
    console.log('🔍 Checking ESP32 connection...');
    
    try {
        // Try multiple methods to detect connection
        const startTime = Date.now();
        
        // Method 1: Try fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        await fetch(`${ESP8266_BASE_URL}/status`, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        // If we got here without error, we're connected
        isConnected = true;
        batteryLevel = 85;
        console.log(`✓ Connected to ESP32 (response time: ${responseTime}ms)`);
        updateUI();
        
    } catch (error) {
        // Connection failed
        isConnected = false;
        batteryLevel = 0;
        console.log('✗ Not connected to ESP32:', error.message);
        updateUI();
    }
}

// Check connection every 3 seconds
setInterval(checkStatus, 3000);

// Initial connection check on page load
checkStatus();

// Update UI Elements
function updateUI() {
    const connectionIcon = document.getElementById('connectionIcon');
    const batteryPercentage = document.getElementById('batteryPercentage');
    
    // Connection Status - toggle WiFi icon
    const wifiConnected = connectionIcon.querySelector('.wifi-connected');
    const wifiDisconnected = connectionIcon.querySelector('.wifi-disconnected');
    
    if (isConnected) {
        wifiConnected.style.display = 'block';
        wifiDisconnected.style.display = 'none';
        connectionIcon.setAttribute('title', 'Connected');
    } else {
        wifiConnected.style.display = 'none';
        wifiDisconnected.style.display = 'block';
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
