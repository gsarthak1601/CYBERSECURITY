# SentinelForce // Cyber Security Interactive Simulation Lab

SentinelForce is a premium, client-side interactive cyber security dashboard designed to educate users about automated credential threat models: **Brute-Force Attacks** and **Dictionary Attacks**. It visually demonstrates the mathematics of password complexity (entropy) and details how server-side policies (Rate Limiting, CAPTCHAs, MFA, Account Lockouts) protect resources against automated cracking tools.

## 🚀 Key Features

*   **Entropy & Complexity Analyzer**: Real-time evaluation of password complexity class, bit entropy, and character set analysis.
*   **Hardware Crack Time Comparison**: Logarithmic comparative grid calculating crack times across consumer CPUs, high-end GPUs (Nvidia RTX 4090), large-scale botnets, and government-grade supercomputers.
*   **Non-Blocking Brute-Force Simulator**: Uses a browser **Web Worker** thread to execute thousands of permutations per second at a constant 60 FPS without freezing the user interface.
*   **Dictionary Leak Simulator**: Visualizes database cross-referencing against a registry of common compromised credentials from data leaks.
*   **Defense Sandbox**: Allows users to toggle mitigation rules (Rate Limiting, CAPTCHAs, MFA, Account Lockouts) and run attacks to observe security block states.
*   **Futuristic Glassmorphic Theme**: Responsive UI using deep Obsidian HSL palettes, neon indicators, custom scrolling, and glowing console headers.

---

## 🛠️ Technical Stack & Architecture

*   **Structure**: Semantic HTML5 with embedded high-performance vector SVGs for crisp offline rendering.
*   **Styles**: Vanilla CSS3 implementing glassmorphism, responsive grids, dark-mode gradients, and CRT scanline overlay filters.
*   **Logic**: Vanilla ES6+ Javascript coordinating simulation events.
*   **Concurrency**: Browser Web Worker API running the mathematical bijection permutation algorithms in a separate background thread.

---

## 💻 Local Setup & Execution

Since the project utilizes a Web Worker, loading the `index.html` directly via the `file://` protocol in some browsers may trigger CORS policy restrictions. To run the project correctly:

### Option 1: Live Server (VS Code)
If you are using VS Code, install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

### Option 2: Python HTTP Server (Built-in)
Open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Option 3: Node.js http-server
Install and run http-server:
```bash
npx http-server -p 8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📂 File Structure

*   [index.html](file:///c:/Users/sarth/Downloads/CS/index.html) - Structural framework and tabbed layouts.
*   [styles.css](file:///c:/Users/sarth/Downloads/CS/styles.css) - CSS variable configurations, theme definitions, animations, and CRT consoles.
*   [app.js](file:///c:/Users/sarth/Downloads/CS/app.js) - UI controllers, event listeners, and Web Worker thread triggers.
*   [simulator-worker.js](file:///c:/Users/sarth/Downloads/CS/simulator-worker.js) - High-speed permutation calculation generator.
*   [common-passwords.js](file:///c:/Users/sarth/Downloads/CS/common-passwords.js) - List of 150+ most common credentials for dictionary attacks.
