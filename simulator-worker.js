// Web Worker for high-speed, non-blocking brute force simulation
let running = false;
let target = "";
let charset = [];
let index = 0;
let speedThrottle = 0; // ms of delay between chunks (for slowdown demonstration)
let chunkSize = 50000;  // How many attempts to run per execution block
let startTime = 0;
let lastUpdate = 0;
let totalAttempts = 0;

// Bijection mapping of integers to unique permutations of a character set in order of length
function getCombination(index, charset) {
    const base = charset.length;
    if (base === 0) return "";
    
    let temp = index;
    let len = 1;
    let countAtLen = base;
    
    // Determine the length and relative offset of the index
    while (temp >= countAtLen) {
        temp -= countAtLen;
        len++;
        countAtLen *= base;
        
        // Prevent overflow errors if index becomes extremely large
        if (!isFinite(countAtLen)) {
            break;
        }
    }
    
    let result = "";
    // Build the string representation from left to right
    for (let i = 0; i < len; i++) {
        const power = Math.pow(base, len - 1 - i);
        const charIndex = Math.floor(temp / power) % base;
        result += charset[charIndex];
    }
    
    return result;
}

self.onmessage = function(e) {
    const data = e.data;
    
    if (data.type === 'start') {
        target = data.target;
        charset = data.charset;
        index = data.startIndex || 0;
        speedThrottle = data.speedThrottle || 0;
        chunkSize = data.chunkSize || 30000;
        running = true;
        startTime = performance.now();
        lastUpdate = startTime;
        totalAttempts = index;
        run();
    } else if (data.type === 'pause') {
        running = false;
        self.postMessage({ type: 'paused', attempts: totalAttempts });
    } else if (data.type === 'stop') {
        running = false;
        index = 0;
        totalAttempts = 0;
        self.postMessage({ type: 'stopped' });
    } else if (data.type === 'updateSpeed') {
        speedThrottle = data.speedThrottle;
        chunkSize = data.chunkSize;
    }
};

function run() {
    if (!running) return;

    let count = 0;
    let found = false;
    let currentGuess = "";

    try {
        while (count < chunkSize && running) {
            currentGuess = getCombination(index, charset);
            count++;
            totalAttempts++;

            if (currentGuess === target) {
                found = true;
                break;
            }
            index++;
        }
    } catch (err) {
        self.postMessage({ type: 'error', message: err.toString() });
        running = false;
        return;
    }

    const now = performance.now();
    if (found) {
        self.postMessage({
            type: 'success',
            guess: currentGuess,
            attempts: totalAttempts,
            time: now - startTime
        });
        running = false;
    } else {
        // Post a progress update if enough time has passed (to keep UI fluid at ~60fps)
        if (now - lastUpdate > 30) {
            self.postMessage({
                type: 'progress',
                guess: currentGuess,
                attempts: totalAttempts,
                time: now - startTime
            });
            lastUpdate = now;
        }

        // Schedule next execution block
        if (running) {
            if (speedThrottle > 0) {
                setTimeout(run, speedThrottle);
            } else {
                // Yield to the event loop so that incoming pause/stop commands can be processed
                setTimeout(run, 0);
            }
        }
    }
}
