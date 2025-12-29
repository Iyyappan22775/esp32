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
    console.log(`🚀 Sending command: ${url}`);
    
    try {
        const response = await fetch(url, { 
            method: 'GET',
            mode: 'no-cors' // For ESP8266 without CORS
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

// Eyes Selector
document.querySelectorAll('.eye-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.eye-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        selectedEye = parseInt(this.dataset.eye);
        sendCommand(`/eyes${selectedEye}`);
    });
});

// Custom Dropdown Handler
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelectorAll('.dropdown-option');
    const modeNum = dropdown.dataset.mode;
    
    // Toggle dropdown
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
    });
    
    // Select option
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.dataset.value;
            const text = this.textContent;
            
            // Update selected display
            selected.textContent = text;
            selected.dataset.value = value;
            
            // Update selected styling
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('active');
            
            // Send command
            sendCommand(`/mode${modeNum}?value=${value}`);
        });
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        d.classList.remove('active');
    });
});

// Direction Pad - Hold to Move
document.querySelectorAll('.segment-btn').forEach(btn => {
    console.log('Direction button found:', btn.dataset.dir);
    let pressTimer = null;
    
    // Mouse events
    btn.addEventListener('mousedown', function() {
        const direction = this.dataset.dir;
        console.log('Mouse down:', direction);
        startMoving(direction);
    });
    
    btn.addEventListener('mouseup', function() {
        console.log('Mouse up');
        stopMoving();
    });
    
    btn.addEventListener('mouseleave', function() {
        console.log('Mouse leave');
        stopMoving();
    });
    
    // Touch events for mobile
    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const direction = this.dataset.dir;
        console.log('Touch start:', direction);
        startMoving(direction);
    });
    
    btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        console.log('Touch end');
        stopMoving();
    });
    
    // Click event as fallback
    btn.addEventListener('click', function(e) {
        console.log('Click detected:', this.dataset.dir);
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
