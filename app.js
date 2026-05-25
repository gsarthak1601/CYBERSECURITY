// SentinelForce Cyber Security Lab - Main Logic Coordinating File

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Sidebar & Tab Navigation
    // -------------------------------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const headerTitle = document.getElementById('currentTabTitle');
    const headerDesc = document.getElementById('currentTabDesc');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    const tabMeta = {
        dashboard:  { title: 'Security Dashboard',         desc: 'Real-time threat modeling and password complexity analysis.' },
        bruteforce: { title: 'Brute-Force Simulator',      desc: 'Visualizing exponential complexity and algorithmic cracking.' },
        dictionary: { title: 'Dictionary Attack Lab',      desc: 'Testing credentials against historical leak directories.' },
        defense:    { title: 'Defense Laboratory',         desc: 'Analyzing firewall, rate limit, and authentication policies.' }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === tabId));
            if (tabMeta[tabId]) {
                headerTitle.textContent = tabMeta[tabId].title;
                headerDesc.textContent  = tabMeta[tabId].desc;
            }
            if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.getAttribute('data-target'));
            if (!el) return;
            el.type = el.type === 'password' ? 'text' : 'password';
        });
    });

    // -------------------------------------------------------------------------
    // 2. Password Strength Analyzer (Dashboard)
    // -------------------------------------------------------------------------
    const quickPasswordInput = document.getElementById('quickPassword');
    const quickStrengthText  = document.getElementById('quickStrengthText');
    const quickStrengthBar   = document.getElementById('quickStrengthBar');
    const quickFeedback      = document.getElementById('quickFeedback');

    if (quickPasswordInput) {
        quickPasswordInput.addEventListener('input', () => evaluatePasswordStrength(quickPasswordInput.value));
        evaluatePasswordStrength('');
    }

    function evaluatePasswordStrength(password) {
        if (!password) {
            if (quickStrengthText) quickStrengthText.textContent = 'Empty';
            if (quickStrengthBar)  quickStrengthBar.className = 'strength-bar';
            if (quickFeedback)     quickFeedback.innerHTML = '<li class="feedback-item warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> Please enter a password to analyze.</li>';
            updateHardwareCrackTimes(0);
            return;
        }
        let score = 0;
        const feedback = [];
        if (password.length >= 12)       { score += 2; feedback.push({ type: 'success', text: `Length: Excellent (${password.length} characters)` }); }
        else if (password.length >= 8)   { score += 1; feedback.push({ type: 'success', text: `Length: Good (${password.length} characters)` }); }
        else                             { feedback.push({ type: 'warning', text: 'Length: Critically short (less than 8 characters)' }); }

        const hasLower  = /[a-z]/.test(password);
        const hasUpper  = /[A-Z]/.test(password);
        const hasDigit  = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (hasLower && hasUpper) { score++; feedback.push({ type: 'success', text: 'Case: Combines upper and lowercase letters' }); }
        else                      { feedback.push({ type: 'warning', text: 'Case: Mix upper and lowercase letters to increase entropy' }); }

        if (hasDigit)  { score++; feedback.push({ type: 'success', text: 'Digits: Contains numbers' }); }
        else           { feedback.push({ type: 'warning', text: 'Digits: Add numeric digits to widen the search space' }); }

        if (hasSymbol) { score++; feedback.push({ type: 'success', text: 'Special characters: Contains symbols' }); }
        else           { feedback.push({ type: 'warning', text: 'Special characters: Add symbols (e.g. @, !, #) for maximum security' }); }

        let alphabetSize = 0;
        if (hasLower)  alphabetSize += 26;
        if (hasUpper)  alphabetSize += 26;
        if (hasDigit)  alphabetSize += 10;
        if (hasSymbol) alphabetSize += 32;

        const totalCombinations = Math.pow(alphabetSize, password.length);
        const entropyBits = Math.log2(totalCombinations);

        let strengthClass = 'strength-weak', strengthLabel = 'Weak';
        if      (score >= 5 && entropyBits >= 60) { strengthClass = 'strength-strong'; strengthLabel = 'Strong (Secure)'; }
        else if (score >= 4 && entropyBits >= 40) { strengthClass = 'strength-good';   strengthLabel = 'Good'; }
        else if (score >= 2 && entropyBits >= 20) { strengthClass = 'strength-fair';   strengthLabel = 'Fair'; }

        if (quickStrengthText) quickStrengthText.textContent = `${strengthLabel} (${Math.round(entropyBits)} bits)`;
        if (quickStrengthBar)  quickStrengthBar.className = `strength-bar ${strengthClass}`;
        if (quickFeedback) {
            quickFeedback.innerHTML = feedback.map(item => `
                <li class="feedback-item ${item.type}">
                    ${item.type === 'success'
                        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/></svg>'
                        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'}
                    ${item.text}
                </li>`).join('');
        }
        updateHardwareCrackTimes(totalCombinations);
    }

    function updateHardwareCrackTimes(totalCombinations) {
        const rates = {
            cpu:    10000000,
            gpu:    10000000000,
            botnet: 1000000000000,
            super:  100000000000000
        };
        const rows = {
            cpu:    document.getElementById('row-cpu'),
            gpu:    document.getElementById('row-gpu'),
            botnet: document.getElementById('row-botnet'),
            super:  document.getElementById('row-super')
        };
        if (!totalCombinations) {
            Object.values(rows).forEach(row => {
                if (!row) return;
                row.querySelector('.hardware-bar').style.width = '0%';
                row.querySelector('.hardware-time').textContent = '0 ms';
                row.className = 'comparison-row';
            });
            return;
        }
        const maxLog = 20;
        Object.keys(rates).forEach(key => {
            const row = rows[key];
            if (!row) return;
            const seconds = totalCombinations / rates[key];
            row.querySelector('.hardware-time').textContent = formatTimeSpan(seconds);
            const logVal = seconds > 0.0001 ? Math.max(0, Math.log10(seconds)) : 0;
            const pct = Math.min(100, Math.max(2, (logVal / maxLog) * 100));
            row.querySelector('.hardware-bar').style.width = `${pct}%`;
            row.className = 'comparison-row';
            if (seconds < 1)               row.classList.add('instant');
            else if (seconds > 31536000*5) row.classList.add('slow');
        });
    }

    function formatTimeSpan(seconds) {
        if (!isFinite(seconds) || seconds > 1e100) return 'Centuries+';
        if (seconds < 0.001) return '< 1 ms';
        if (seconds < 1)     return `${Math.round(seconds * 1000)} ms`;
        if (seconds < 60)    return `${seconds.toFixed(2)} seconds`;
        const minutes = seconds / 60;
        if (minutes < 60) return `${minutes.toFixed(1)} mins`;
        const hours = minutes / 60;
        if (hours < 24)   return `${hours.toFixed(1)} hours`;
        const days = hours / 24;
        if (days < 365)   return `${days.toFixed(1)} days`;
        const years = days / 365;
        if (years < 1000)    return `${years.toFixed(1)} years`;
        if (years < 1000000) return `${Math.round(years / 1000)}k years`;
        return `${(years / 1000000).toFixed(1)}M years`;
    }

    // -------------------------------------------------------------------------
    // 3. Brute-Force Simulator — Inline Blob Web Worker
    //    Using a Blob URL means it works on both file:// and http:// without CORS
    // -------------------------------------------------------------------------
    const bfPassword    = document.getElementById('bfPassword');
    const cbLower       = document.getElementById('charset-lower');
    const cbUpper       = document.getElementById('charset-upper');
    const cbNumeric     = document.getElementById('charset-numeric');
    const cbSymbols     = document.getElementById('charset-symbols');
    const bfSpeed       = document.getElementById('bfSpeed');
    const speedText     = document.getElementById('speedText');
    const btnBfStart    = document.getElementById('btnBfStart');
    const btnBfPause    = document.getElementById('btnBfPause');
    const btnBfReset    = document.getElementById('btnBfReset');
    const metricAttempts = document.getElementById('metric-attempts');
    const metricTime     = document.getElementById('metric-time');
    const metricSpeed    = document.getElementById('metric-speed');
    const metricSpace    = document.getElementById('metric-space');
    const bfConsole      = document.getElementById('bfConsole');
    const mathFormulaText  = document.getElementById('mathFormulaText');
    const mathCalculations = document.getElementById('mathCalculations');

    let bfWorker    = null;
    let isBfRunning = false;
    let isBfPaused  = false;
    let bfStartIndex = 0;   // permutation index to resume from
    let bfElapsedMs  = 0;   // elapsed ms accumulated across pause sessions

    // Full worker logic embedded as a string — avoids file:// CORS errors with Worker()
    const WORKER_CODE = `
        'use strict';
        let running = false, target = '', charset = [], idx = 0;
        let speedThrottle = 0, chunkSize = 30000;
        let startTime = 0, lastUpdate = 0, totalAttempts = 0, elapsedOffset = 0;

        function getCombination(n, cs) {
            const base = cs.length;
            if (base === 0) return '';
            let temp = n, len = 1, count = base;
            while (temp >= count) { temp -= count; len++; count *= base; if (!isFinite(count)) break; }
            let s = '';
            for (let i = 0; i < len; i++) {
                const p = Math.pow(base, len - 1 - i);
                s += cs[Math.floor(temp / p) % base];
            }
            return s;
        }

        self.onmessage = function(e) {
            const d = e.data;
            if (d.type === 'start') {
                target = d.target; charset = d.charset; idx = d.startIndex || 0;
                speedThrottle = d.speedThrottle || 0; chunkSize = d.chunkSize || 30000;
                elapsedOffset = d.elapsedOffset || 0;
                running = true; startTime = performance.now(); lastUpdate = startTime;
                totalAttempts = idx;
                run();
            } else if (d.type === 'pause') {
                running = false;
                const elapsed = elapsedOffset + (performance.now() - startTime);
                self.postMessage({ type: 'paused', attempts: totalAttempts, elapsedMs: elapsed, resumeIndex: idx });
            } else if (d.type === 'stop') {
                running = false;
                self.postMessage({ type: 'stopped' });
            } else if (d.type === 'updateSpeed') {
                speedThrottle = d.speedThrottle; chunkSize = d.chunkSize;
            }
        };

        function run() {
            if (!running) return;
            let count = 0, found = false, guess = '';
            try {
                while (count < chunkSize && running) {
                    guess = getCombination(idx, charset);
                    count++; totalAttempts++;
                    if (guess === target) { found = true; break; }
                    idx++;
                }
            } catch(err) {
                self.postMessage({ type: 'error', message: err.toString() }); running = false; return;
            }
            const now = performance.now();
            const elapsed = elapsedOffset + (now - startTime);
            if (found) {
                running = false;
                self.postMessage({ type: 'success', guess: guess, attempts: totalAttempts, time: elapsed });
            } else {
                if (now - lastUpdate > 30) {
                    self.postMessage({ type: 'progress', guess: guess, attempts: totalAttempts, time: elapsed });
                    lastUpdate = now;
                }
                if (running) setTimeout(run, speedThrottle > 0 ? speedThrottle : 0);
            }
        }
    `;

    function createBfWorker() {
        if (bfWorker) { bfWorker.terminate(); bfWorker = null; }
        const blob    = new Blob([WORKER_CODE], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        bfWorker      = new Worker(blobUrl);
        URL.revokeObjectURL(blobUrl);

        bfWorker.onmessage = function(e) {
            const d = e.data;
            if (d.type === 'progress') {
                updateBfStats(d.attempts, d.time);
                const inp = document.getElementById('console-current-input');
                if (inp) inp.textContent = d.guess;
                if (Math.random() < 0.15) {
                    printBfConsole(`[~] Attempt #${d.attempts.toLocaleString()}: "${d.guess}" ... MISMATCH`, 'info');
                }
            } else if (d.type === 'success') {
                isBfRunning = false; isBfPaused = false;
                updateBfStats(d.attempts, d.time);
                const inp = document.getElementById('console-current-input');
                if (inp) inp.textContent = d.guess;
                printBfConsole(`[✓] CRACKED: "${d.guess}" found at attempt #${d.attempts.toLocaleString()}`, 'success');
                printBfConsole(`[+] TIME TO CRACK: ${formatTimeSpan(d.time / 1000)}`, 'success');
                printBfConsole(`[+] ATTACK TERMINATED.`, 'success');
                setBfBtnStates(false, false);
            } else if (d.type === 'paused') {
                isBfRunning = false; isBfPaused = true;
                bfStartIndex = d.resumeIndex; bfElapsedMs = d.elapsedMs;
                printBfConsole(`[!] Paused at attempt #${d.attempts.toLocaleString()}. Click Resume to continue.`, 'warning');
                setBfBtnStates(false, true);
            } else if (d.type === 'stopped') {
                isBfRunning = false; isBfPaused = false;
                bfStartIndex = 0; bfElapsedMs = 0;
                printBfConsole('[+] Engine stopped and reset.', 'info');
                setBfBtnStates(false, false);
            } else if (d.type === 'error') {
                printBfConsole(`[ERR] ${d.message}`, 'error');
                isBfRunning = false; setBfBtnStates(false, false);
            }
        };
        bfWorker.onerror = function(err) {
            printBfConsole(`[ERR] Worker crashed: ${err.message}`, 'error');
            isBfRunning = false; setBfBtnStates(false, false);
        };
    }

    function getSelectedCharset() {
        let c = '';
        if (cbLower   && cbLower.checked)   c += 'abcdefghijklmnopqrstuvwxyz';
        if (cbUpper   && cbUpper.checked)   c += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (cbNumeric && cbNumeric.checked) c += '0123456789';
        if (cbSymbols && cbSymbols.checked) c += '!@#$%^&*()_+-=[]{}|;\':",./<>?';
        return c.split('');
    }

    // Checkbox card highlight styling
    document.querySelectorAll('.checkbox-card').forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                card.classList.toggle('selected', checkbox.checked);
                updateMathBreakdown();
            });
        }
    });

    if (bfPassword) bfPassword.addEventListener('input', updateMathBreakdown);

    function updateMathBreakdown() {
        if (!bfPassword || !mathFormulaText || !mathCalculations) return;
        const target  = bfPassword.value;
        const charset = getSelectedCharset();
        const L = target.length, C = charset.length;
        mathFormulaText.textContent = `S = ${C}^${L}`;
        if (C === 0 || L === 0) {
            mathCalculations.textContent = 'Select a character set and enter a target password.';
            if (metricSpace) metricSpace.textContent = '0';
            return;
        }
        const space = Math.pow(C, L);
        const fmt   = space.toLocaleString('en-US', { maximumFractionDigits: 0 });
        if (metricSpace) metricSpace.textContent = space > 1e12 ? space.toExponential(2) : fmt;
        mathCalculations.innerHTML = `Length <strong>${L}</strong>, alphabet <strong>${C}</strong> chars &rarr; <strong>${space > 1e12 ? space.toExponential(3) : fmt}</strong> combinations.`;
    }
    updateMathBreakdown();

    if (bfSpeed && speedText) {
        bfSpeed.addEventListener('input', () => {
            const v = parseInt(bfSpeed.value);
            if (v === 0)       speedText.textContent = 'Instant (Max Power)';
            else if (v < 25)   speedText.textContent = 'Fast (20ms delay)';
            else if (v < 75)   speedText.textContent = 'Medium (50ms delay)';
            else               speedText.textContent = 'Slow Mode (100ms delay)';
            if (isBfRunning && bfWorker) {
                const s = getSpeedSettings(v);
                bfWorker.postMessage({ type: 'updateSpeed', speedThrottle: s.throttle, chunkSize: s.chunk });
            }
        });
    }

    function getSpeedSettings(v) {
        if (v === 0)     return { throttle: 0,   chunk: 30000 };
        if (v < 25)      return { throttle: 20,  chunk: 5000  };
        if (v < 75)      return { throttle: 50,  chunk: 1000  };
        return               { throttle: 100, chunk: 100   };
    }

    function printBfConsole(text, type = 'info') {
        if (!bfConsole) return;
        const el = document.createElement('div');
        el.className = `console-log-entry ${type}`;
        el.textContent = text;
        const inputLine = bfConsole.querySelector('.console-input-line');
        if (inputLine) bfConsole.insertBefore(el, inputLine);
        else bfConsole.appendChild(el);
        bfConsole.scrollTop = bfConsole.scrollHeight;
    }

    // Also expose printConsole globally for other tabs
    function printConsole(text, type = 'info', consoleEl) {
        if (!consoleEl) return;
        const el = document.createElement('div');
        el.className = `console-log-entry ${type}`;
        el.textContent = text;
        const inputLine = consoleEl.querySelector('.console-input-line');
        if (inputLine) consoleEl.insertBefore(el, inputLine);
        else consoleEl.appendChild(el);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function updateBfStats(attempts, elapsedMs) {
        if (metricAttempts) metricAttempts.textContent = attempts.toLocaleString();
        const sec = elapsedMs / 1000;
        if (metricTime)  metricTime.textContent  = `${sec.toFixed(2)}s`;
        if (metricSpeed) metricSpeed.textContent = sec > 0.05 ? Math.round(attempts / sec).toLocaleString() : 'Calculating...';
    }

    // running = actively processing, paused = stopped with saved state
    function setBfBtnStates(running, paused) {
        if (btnBfStart) {
            btnBfStart.disabled = running;
            btnBfStart.innerHTML = paused
                ? '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg> Resume'
                : '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg> Start Attack';
        }
        // Pause: enabled only while running; Reset: enabled when running OR paused
        if (btnBfPause) btnBfPause.disabled = !running;
        if (btnBfReset) btnBfReset.disabled = !running && !paused;
        if (bfPassword) bfPassword.disabled = running;
        if (cbLower)    cbLower.disabled    = running;
        if (cbUpper)    cbUpper.disabled    = running;
        if (cbNumeric)  cbNumeric.disabled  = running;
        if (cbSymbols)  cbSymbols.disabled  = running;
    }

    if (btnBfStart) {
        btnBfStart.addEventListener('click', () => {
            const target  = bfPassword.value.trim();
            const charset = getSelectedCharset();
            if (!target)           { alert('Please enter a target password.'); return; }
            if (!charset.length)   { alert('Please select at least one character set.'); return; }

            // Auto-fix missing character sets
            const missing = [...target].filter(c => !charset.includes(c));
            if (missing.length) {
                let hint = '';
                if (/[a-z]/.test(missing[0]) && cbLower   && !cbLower.checked)   { cbLower.checked   = true; cbLower.closest('.checkbox-card').classList.add('selected');   hint += 'Lowercase '; }
                if (/[A-Z]/.test(missing[0]) && cbUpper   && !cbUpper.checked)   { cbUpper.checked   = true; cbUpper.closest('.checkbox-card').classList.add('selected');   hint += 'Uppercase '; }
                if (/[0-9]/.test(missing[0]) && cbNumeric && !cbNumeric.checked) { cbNumeric.checked = true; cbNumeric.closest('.checkbox-card').classList.add('selected'); hint += 'Numeric '; }
                if (/[^a-zA-Z0-9]/.test(missing[0]) && cbSymbols && !cbSymbols.checked) { cbSymbols.checked = true; cbSymbols.closest('.checkbox-card').classList.add('selected'); hint += 'Special '; }
                alert(`Password contains characters outside active sets.\nAuto-enabled: ${hint}\nClick Start Attack again.`);
                updateMathBreakdown();
                return;
            }

            if (!isBfPaused) {
                // Fresh start
                createBfWorker();
                bfStartIndex = 0; bfElapsedMs = 0;
                if (bfConsole) {
                    bfConsole.innerHTML = '<div class="console-input-line"><span class="console-prompt">guest@sentinel:~$</span><span id="console-current-input"></span><span class="console-cursor"></span></div>';
                }
                printBfConsole('[+] Initializing attack vector...', 'warning');
                printBfConsole(`[+] Target: "${target}" | Alphabet: ${charset.length} chars | Space: ${Math.pow(charset.length, target.length).toLocaleString()} combos`, 'info');
            } else {
                // Resume from paused state
                if (!bfWorker) createBfWorker();
                printBfConsole(`[+] Resuming from index #${bfStartIndex.toLocaleString()}...`, 'warning');
            }

            isBfRunning = true; isBfPaused = false;
            setBfBtnStates(true, false);

            const s = getSpeedSettings(parseInt(bfSpeed ? bfSpeed.value : 0));
            bfWorker.postMessage({
                type: 'start', target, charset,
                startIndex: bfStartIndex, elapsedOffset: bfElapsedMs,
                speedThrottle: s.throttle, chunkSize: s.chunk
            });
        });
    }

    if (btnBfPause) {
        btnBfPause.addEventListener('click', () => {
            if (bfWorker && isBfRunning) {
                bfWorker.postMessage({ type: 'pause' });
                isBfRunning = false;
            }
        });
    }

    if (btnBfReset) {
        btnBfReset.addEventListener('click', () => {
            if (bfWorker) { bfWorker.terminate(); bfWorker = null; }
            isBfRunning = false; isBfPaused = false;
            bfStartIndex = 0;   bfElapsedMs = 0;
            if (metricAttempts) metricAttempts.textContent = '0';
            if (metricTime)     metricTime.textContent     = '0.00s';
            if (metricSpeed)    metricSpeed.textContent    = '0';
            if (bfConsole) {
                bfConsole.innerHTML = '<div class="console-log-entry info">System ready. Set parameters and start simulation.</div><div class="console-input-line"><span class="console-prompt">guest@sentinel:~$</span><span id="console-current-input"></span><span class="console-cursor"></span></div>';
            }
            setBfBtnStates(false, false);
        });
    }

    // -------------------------------------------------------------------------
    // 4. Dictionary Attack Lab
    // -------------------------------------------------------------------------
    const dictPassword = document.getElementById('dictPassword');
    const btnDictStart = document.getElementById('btnDictStart');
    const btnDictReset = document.getElementById('btnDictReset');
    const dictStatus   = document.getElementById('dict-status');
    const dictTime     = document.getElementById('dict-time');
    const dictConsole  = document.getElementById('dictConsole');

    let dictInterval = null;

    if (btnDictStart) {
        btnDictStart.addEventListener('click', () => {
            const target = dictPassword.value.trim();
            if (!target) { alert('Please enter a password to run the dictionary query.'); return; }

            clearInterval(dictInterval);
            if (dictConsole) dictConsole.innerHTML = '<div class="console-input-line"><span class="console-prompt">db_searcher:~$</span><span id="dict-current-input"></span><span class="console-cursor"></span></div>';
            if (dictStatus) { dictStatus.textContent = 'SEARCHING...'; dictStatus.className = 'metric-value highlight'; }
            if (dictTime)   dictTime.textContent = '-- ms';

            printConsole('[+] Connecting to Leak Registry... SUCCESS', 'info', dictConsole);
            printConsole(`[+] Target query: "${target}"`, 'info', dictConsole);
            printConsole(`[+] Database contains ${(window.COMMON_PASSWORDS || []).length} leaked entries.`, 'info', dictConsole);

            let i = 0;
            const db = window.COMMON_PASSWORDS || [];
            const start = performance.now();

            dictInterval = setInterval(() => {
                if (i < db.length) {
                    const word = db[i];
                    const inputLine = dictConsole ? dictConsole.querySelector('#dict-current-input') : null;
                    if (inputLine) inputLine.textContent = `CHECKING [${i}]: ${word}`;
                    if (Math.random() < 0.12) printConsole(`[-] [${i}] "${word}" — MISMATCH`, 'info', dictConsole);
                    if (word === target) {
                        clearInterval(dictInterval);
                        const ms = (performance.now() - start).toFixed(1);
                        if (dictTime)   dictTime.textContent = `${ms} ms`;
                        if (dictStatus) { dictStatus.textContent = 'COMPROMISED'; dictStatus.className = 'metric-value danger'; }
                        if (inputLine)  inputLine.textContent = target;
                        printConsole(`[!!!] MATCH: "${word}" found at rank #${i + 1}`, 'error', dictConsole);
                        printConsole('[!] WARNING: This password exists in leaked databases!', 'error', dictConsole);
                        printConsole('[+] Threat Status: CRITICAL', 'error', dictConsole);
                    }
                    i++;
                } else {
                    clearInterval(dictInterval);
                    const ms = (performance.now() - start).toFixed(1);
                    if (dictTime)   dictTime.textContent = `${ms} ms`;
                    if (dictStatus) { dictStatus.textContent = 'NOT FOUND'; dictStatus.className = 'metric-value success'; }
                    const inputLine = dictConsole ? dictConsole.querySelector('#dict-current-input') : null;
                    if (inputLine)  inputLine.textContent = '';
                    printConsole(`[+] Checked ${db.length} entries — no match found.`, 'success', dictConsole);
                    printConsole('[+] Status: SECURE against basic wordlist attacks.', 'success', dictConsole);
                }
            }, 10);
        });
    }

    if (btnDictReset) {
        btnDictReset.addEventListener('click', () => {
            clearInterval(dictInterval);
            if (dictStatus) { dictStatus.textContent = 'NOT SEARCHED'; dictStatus.className = 'metric-value danger'; }
            if (dictTime)   dictTime.textContent = '-- ms';
            if (dictConsole) dictConsole.innerHTML = '<div class="console-log-entry info">Idle. Waiting for a password match command...</div><div class="console-input-line"><span class="console-prompt">db_searcher:~$</span><span id="dict-current-input"></span><span class="console-cursor"></span></div>';
        });
    }

    // -------------------------------------------------------------------------
    // 5. Defense Laboratory Sandbox
    // -------------------------------------------------------------------------
    const defPassword     = document.getElementById('defPassword');
    const chkRate         = document.getElementById('def-rate');
    const chkCaptcha      = document.getElementById('def-captcha');
    const chkLockout      = document.getElementById('def-lockout');
    const chkMfa          = document.getElementById('def-mfa');
    const btnDefStart     = document.getElementById('btnDefStart');
    const btnDefReset     = document.getElementById('btnDefReset');
    const activeCountText = document.getElementById('def-active-count');
    const attemptsLeftText= document.getElementById('def-attempts-left');
    const outcomeText     = document.getElementById('def-outcome');
    const defConsole      = document.getElementById('defConsole');

    let sandboxTimeout = null;

    document.querySelectorAll('.defense-toggle-card').forEach(card => {
        const cb = card.querySelector('input[type="checkbox"]');
        if (cb) {
            cb.addEventListener('change', () => { card.classList.toggle('enabled', cb.checked); updateShieldCount(); });
            card.addEventListener('click', e => {
                if (e.target !== cb && !e.target.closest('.switch')) {
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event('change'));
                }
            });
        }
    });

    function updateShieldCount() {
        let count = 0;
        if (chkRate    && chkRate.checked)    count++;
        if (chkCaptcha && chkCaptcha.checked) count++;
        if (chkLockout && chkLockout.checked) count++;
        if (chkMfa     && chkMfa.checked)     count++;
        if (activeCountText) activeCountText.textContent = `${count} Shield${count === 1 ? '' : 's'} Engaged`;
    }

    if (btnDefStart) {
        btnDefStart.addEventListener('click', () => {
            const target = defPassword.value.trim();
            if (!target) { alert('Please enter a password for the simulation.'); return; }

            clearTimeout(sandboxTimeout);
            if (defConsole) defConsole.innerHTML = '<div class="console-input-line"><span class="console-prompt">sandbox_auth:~$</span><span id="def-current-input"></span><span class="console-cursor"></span></div>';
            if (outcomeText)      { outcomeText.textContent = 'ATTACKING...'; outcomeText.className = 'metric-value highlight'; }
            if (attemptsLeftText)   attemptsLeftText.textContent = 'Unlimited';

            printConsole('[+] Connecting attack vector to Target Endpoint...', 'info', defConsole);
            printConsole(`[+] Target password size: ${target.length} characters.`, 'info', defConsole);

            const rate    = chkRate    && chkRate.checked;
            const captcha = chkCaptcha && chkCaptcha.checked;
            const lockout = chkLockout && chkLockout.checked;
            const mfa     = chkMfa     && chkMfa.checked;
            let attemptNum = 1;

            function runSandboxStep() {
                const defInputLine = defConsole ? defConsole.querySelector('#def-current-input') : null;
                if (defInputLine) defInputLine.textContent = `Login attempt #${attemptNum}...`;

                if (mfa) {
                    printConsole(`[!] Attempt #${attemptNum}: Password OK — MFA challenge required.`, 'warning', defConsole);
                    printConsole('[-] BLOCKED: OTP token required. Script cannot read authenticator app.', 'error', defConsole);
                    printConsole('[+] ATTACK NEUTRALIZED — MFA prevents automated cracking.', 'success', defConsole);
                    if (outcomeText)      { outcomeText.textContent = 'BLOCKED (MFA)'; outcomeText.className = 'metric-value success'; }
                    if (attemptsLeftText)   attemptsLeftText.textContent = '0';
                    if (defInputLine)       defInputLine.textContent = '';
                    return;
                }
                if (lockout && attemptNum > 3) {
                    printConsole('[!] LOCKOUT TRIGGERED: 3 consecutive failed attempts.', 'error', defConsole);
                    printConsole('[-] Server returned HTTP 423 (Locked). Account frozen for 1 hour.', 'error', defConsole);
                    printConsole('[+] ATTACK FAILED — Account lockout policy activated.', 'success', defConsole);
                    if (outcomeText)      { outcomeText.textContent = 'ACCOUNT LOCKED'; outcomeText.className = 'metric-value success'; }
                    if (attemptsLeftText)   attemptsLeftText.textContent = '0';
                    if (defInputLine)       defInputLine.textContent = '';
                    return;
                }
                const isCorrect = (!lockout && attemptNum >= 5);
                if (isCorrect) {
                    printConsole(`[!] MATCH FOUND — Credentials accepted after ${attemptNum} attempts!`, 'success', defConsole);
                    printConsole('[+] ACCESS GRANTED. Attack completed.', 'success', defConsole);
                    if (outcomeText)      { outcomeText.textContent = 'COMPROMISED'; outcomeText.className = 'metric-value danger'; }
                    if (defInputLine)       defInputLine.textContent = '';
                    return;
                }
                printConsole(`[-] Attempt #${attemptNum}: "guess${attemptNum}" — HTTP 401 Unauthorized`, 'error', defConsole);
                if (lockout && attemptsLeftText) attemptsLeftText.textContent = `${Math.max(0, 3 - attemptNum)} left`;
                attemptNum++;

                let delay = 200;
                if (captcha) { printConsole('[!] CAPTCHA: 1.5s challenge enforced.', 'warning', defConsole); delay += 1500; }
                if (rate && attemptNum > 3) { printConsole('[!] RATE LIMIT: 3.0s cooling period enforced.', 'warning', defConsole); delay += 3000; }
                sandboxTimeout = setTimeout(runSandboxStep, delay);
            }
            sandboxTimeout = setTimeout(runSandboxStep, 300);
        });
    }

    if (btnDefReset) {
        btnDefReset.addEventListener('click', () => {
            clearTimeout(sandboxTimeout);
            if (outcomeText)      { outcomeText.textContent = 'IDLE'; outcomeText.className = 'metric-value highlight'; }
            if (attemptsLeftText)   attemptsLeftText.textContent = 'Unlimited';
            if (defConsole) defConsole.innerHTML = '<div class="console-log-entry info">Defense sandbox ready. Toggle policies on the left, then click Launch Sandbox Attack.</div><div class="console-input-line"><span class="console-prompt">sandbox_auth:~$</span><span id="def-current-input"></span><span class="console-cursor"></span></div>';
        });
    }

});
