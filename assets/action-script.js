// ESP8266 Configuration
const ESP8266_BASE_URL = 'http://192.168.4.1';

// State
let isConnected = false;
let batteryLevel = 85;
let selectedHand = 'left';

// Previous values storage for undo functionality
let previousLeftHandValues = null;
let previousRightHandValues = null;
let previousBothHandsValues = null;

// Separate values for each hand
let leftHandValues = {
    head: 2000,
    lateral: 2000,
    shoulder: 2000,
    forearm: 2000,
    elbow: 2000,
    wrist: 2000,
    fingers: 2000
};

let rightHandValues = {
    head: 2000,
    lateral: 2000,
    shoulder: 2000,
    forearm: 2000,
    elbow: 2000,
    wrist: 2000,
    fingers: 2000
};

let bothHandsValues = {
    head: 2000,
    lateral: 2000,
    shoulder: 2000,
    forearm: 2000,
    elbow: 2000,
    wrist: 2000,
    fingers: 2000
};

// Get current hand values based on selection
function getCurrentHandValues() {
    if (selectedHand === 'left') return leftHandValues;
    if (selectedHand === 'right') return rightHandValues;
    return bothHandsValues;
}

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

// Hand Selection
document.querySelectorAll('.hand-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.hand-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        selectedHand = this.dataset.hand;
        sendCommand(`/hand?value=${selectedHand}`);
        
        // Update sliders to show values for selected hand
        updateSlidersForCurrentHand();
    });
});

// Update all sliders to show current hand values
function updateSlidersForCurrentHand() {
    const currentValues = getCurrentHandValues();
    
    document.querySelectorAll('.body-slider').forEach(slider => {
        const part = slider.dataset.part;
        const value = currentValues[part];
        
        slider.value = value;
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        valueDisplay.textContent = value;
        
        // Update slider gradient
        const percentage = (value / 2000) * 100;
        slider.style.background = `linear-gradient(to right, #00D9FF 0%, #00D9FF ${percentage}%, #4A4F6A ${percentage}%)`;
    });
}

// Top Speed Control
const topSpeedRange = document.getElementById('topSpeedRange');
const topSpeedValue = document.getElementById('topSpeedValue');

topSpeedRange.addEventListener('input', function() {
    topSpeedValue.textContent = this.value;
});

topSpeedRange.addEventListener('change', function() {
    sendCommand(`/speed?value=${this.value}`);
});

// Home Button - Reset all sliders to 1000
document.getElementById('homeBtn').addEventListener('click', function() {
    // Save current values as previous before resetting
    if (selectedHand === 'left') {
        previousLeftHandValues = {...leftHandValues};
    } else if (selectedHand === 'right') {
        previousRightHandValues = {...rightHandValues};
    } else {
        previousBothHandsValues = {...bothHandsValues};
    }
    
    // Reset all sliders to 1000
    document.querySelectorAll('.body-slider').forEach(slider => {
        slider.value = 1000;
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        valueDisplay.textContent = '1000';
        
        // Update gradient (1000 is 50% of 2000)
        slider.style.background = `linear-gradient(to right, #00D9FF 0%, #00D9FF 50%, #4A4F6A 50%)`;
        
        // Update values in state
        const part = slider.dataset.part;
        if (selectedHand === 'left') {
            leftHandValues[part] = 1000;
        } else if (selectedHand === 'right') {
            rightHandValues[part] = 1000;
        } else {
            bothHandsValues[part] = 1000;
        }
    });
    
    // Send HTTP command
    sendCommand('/home');
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// History stack for undo functionality (stores individual changes)
let changeHistory = [];

// Body Part Sliders
document.querySelectorAll('.body-slider').forEach(slider => {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    let previousValue = parseInt(slider.value); // Store initial value
    
    slider.addEventListener('input', function() {
        const value = this.value;
        const part = this.dataset.part;
        valueDisplay.textContent = value;
        
        // Update slider gradient
        const percentage = (value / 2000) * 100;
        this.style.background = `linear-gradient(to right, #00D9FF 0%, #00D9FF ${percentage}%, #4A4F6A ${percentage}%)`;
    });
    
    slider.addEventListener('change', function() {
        const part = this.dataset.part;
        const value = parseInt(this.value);
        
        // Save previous value to history BEFORE updating
        changeHistory.push({
            hand: selectedHand,
            part: part,
            value: previousValue
        });
        
        // Update previous value for next change
        previousValue = value;
        
        // Store value in current hand's values
        const currentValues = getCurrentHandValues();
        currentValues[part] = value;
        
        // Limit history to last 50 changes
        if (changeHistory.length > 50) {
            changeHistory.shift();
        }
        
        sendCommand(`/position?part=${part}&value=${value}&hand=${selectedHand}`);
    });
    
    // Initialize gradient
    const initialPercentage = (slider.value / 2000) * 100;
    slider.style.background = `linear-gradient(to right, #00D9FF 0%, #00D9FF ${initialPercentage}%, #4A4F6A ${initialPercentage}%)`;
});

// Saved positions array
let savedPositions = [];
let positionCounter = 1;

// Save Button - Saves all 7 body part values as ONE position
document.getElementById('saveBtn').addEventListener('click', function() {
    const currentValues = getCurrentHandValues();
    
    // Create position object
    const position = {
        number: positionCounter,
        hand: selectedHand,
        values: {...currentValues}
    };
    
    // Add to saved positions
    savedPositions.push(position);
    
    // Build HTTP request with position number
    const params = new URLSearchParams();
    params.append('pos', positionCounter);
    params.append('hand', selectedHand);
    for (const [part, value] of Object.entries(currentValues)) {
        params.append(part, value);
    }
    
    sendCommand(`/save_pose?${params.toString()}`);
    
    // Show notification
    showSaveNotification(positionCounter);
    
    // Increment counter
    positionCounter++;
    
    console.log(`Position ${position.number} saved for ${selectedHand} hand:`, currentValues);
});

// Show save notification
function showSaveNotification(posNum) {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = `Position ${posNum} Saved`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

// Display saved positions as tags
function displaySavedPositions() {
    const container = document.getElementById('savedPositions');
    container.innerHTML = '';
    
    savedPositions.forEach(pos => {
        const tag = document.createElement('div');
        tag.className = 'position-tag';
        tag.textContent = `Position ${pos.number}`;
        container.appendChild(tag);
    });
}

// Show delete notification
function showDeleteNotification(posNum) {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = `Position ${posNum} Deleted`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

// Previous/Rewind Button - Remove last saved position (Undo functionality)
document.getElementById('previousBtn').addEventListener('click', function() {
    if (savedPositions.length === 0) {
        console.log('No positions to undo');
        return;
    }
    
    // Remove last position
    const removed = savedPositions.pop();
    positionCounter--;
    
    // Send undo command
    sendCommand('/loop_undo');
    
    // Show delete notification
    showDeleteNotification(removed.number);
    
    console.log(`Position ${removed.number} removed`);
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Loop state
let isLooping = false;

// Loop Button - Start/Stop looping through ALL saved positions
document.getElementById('loopBtn').addEventListener('click', function() {
    if (savedPositions.length === 0 && !isLooping) {
        console.log('No positions saved to loop');
        return;
    }
    
    // Toggle loop state
    isLooping = !isLooping;
    
    if (isLooping) {
        // Start loop
        sendCommand('/loop_start');
        this.classList.add('active');
        this.textContent = 'Stop Loop';
        
        // Disable all sliders
        document.querySelectorAll('.body-slider').forEach(slider => {
            slider.disabled = true;
            slider.style.opacity = '0.5';
            slider.style.cursor = 'not-allowed';
        });
        
        // Disable save button
        document.getElementById('saveBtn').disabled = true;
        document.getElementById('saveBtn').style.opacity = '0.5';
        document.getElementById('saveBtn').style.cursor = 'not-allowed';
        
        // Disable home button
        document.getElementById('homeBtn').disabled = true;
        document.getElementById('homeBtn').style.opacity = '0.5';
        document.getElementById('homeBtn').style.cursor = 'not-allowed';
        document.getElementById('homeBtn').style.pointerEvents = 'none';
        
        // Disable previous/rewind button
        document.getElementById('previousBtn').disabled = true;
        document.getElementById('previousBtn').style.opacity = '0.5';
        document.getElementById('previousBtn').style.cursor = 'not-allowed';
        document.getElementById('previousBtn').style.pointerEvents = 'none';
        
        console.log(`Loop started with ${savedPositions.length} positions`);
    } else {
        // Stop loop
        sendCommand('/loop_stop');
        this.classList.remove('active');
        this.textContent = 'Start Loop';
        
        // Enable all sliders
        document.querySelectorAll('.body-slider').forEach(slider => {
            slider.disabled = false;
            slider.style.opacity = '1';
            slider.style.cursor = 'pointer';
        });
        
        // Enable save button
        document.getElementById('saveBtn').disabled = false;
        document.getElementById('saveBtn').style.opacity = '1';
        document.getElementById('saveBtn').style.cursor = 'pointer';
        
        // Enable home button
        document.getElementById('homeBtn').disabled = false;
        document.getElementById('homeBtn').style.opacity = '1';
        document.getElementById('homeBtn').style.cursor = 'pointer';
        document.getElementById('homeBtn').style.pointerEvents = 'auto';
        
        // Enable previous/rewind button
        document.getElementById('previousBtn').disabled = false;
        document.getElementById('previousBtn').style.opacity = '1';
        document.getElementById('previousBtn').style.cursor = 'pointer';
        document.getElementById('previousBtn').style.pointerEvents = 'auto';
        
        console.log('Loop stopped');
    }
});

// Delete Button - Delete all saved positions
document.getElementById('deleteBtn').addEventListener('click', function() {
    if (savedPositions.length === 0) {
        console.log('No positions to delete');
        return;
    }
    
    // Store count before clearing
    const deletedCount = savedPositions.length;
    
    // Clear all saved positions
    savedPositions = [];
    positionCounter = 1;
    
    // Send delete command to ESP8266
    sendCommand('/loop_delete');
    
    // Show delete notification
    showDeleteLoopNotification(deletedCount);
    
    console.log(`All ${deletedCount} positions deleted`);
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Show delete loop notification
function showDeleteLoopNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = 'Loop Deleted';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

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
    console.log('Update ESP8266_BASE_URL in action-script.js to connect to your device');
}, 1000);
