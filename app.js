// --- 1. NAVEGACIÓN ENTRE PESTAÑAS ---
const navBtns = document.querySelectorAll('.nav-btn');
const tabSections = document.querySelectorAll('.tab-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        tabSections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        const targetSection = document.getElementById(btn.dataset.target);
        if (targetSection) targetSection.classList.add('active');
    });
});

// --- 2. EDITOR DE CÓDIGO & PREVIEW ---
const codeTextarea = document.getElementById('code-textarea');
const livePreview = document.getElementById('live-preview');
const fileSelect = document.getElementById('file-select');

const files = {
    'index.html': '<h1>¡Hola Mundo!</h1>\n<p>Edita este código y mira el resultado en tiempo real.</p>',
    'style.css': 'body { font-family: sans-serif; text-align: center; margin-top: 50px; background: #f0f0f0; }',
    'app.js': 'console.log("DevSuite Activo");'
};

fileSelect.addEventListener('change', (e) => {
    codeTextarea.value = files[e.target.value];
});

codeTextarea.value = files['index.html'];

function updatePreview() {
    files[fileSelect.value] = codeTextarea.value;
    const htmlContent = files['index.html'];
    const cssContent = files['style.css'];
    const jsContent = files['app.js'];

    const fullDoc = `
        <!DOCTYPE html>
        <html>
        <head><style>${cssContent}</style></head>
        <body>
            ${htmlContent}
            <script>${jsContent}<\/script>
        </body>
        </html>
    `;

    const blob = new Blob([fullDoc], { type: 'text/html' });
    livePreview.src = URL.createObjectURL(blob);
}

codeTextarea.addEventListener('input', updatePreview);
updatePreview();

// --- GUARDAR ARCHIVO INDIVIDUAL EN LA PC ---
document.getElementById('save-file-btn').addEventListener('click', () => {
    const currentFilename = fileSelect.value;
    const currentContent = codeTextarea.value;
    
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// --- 3. ESTUDIO JSON ---
const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');

document.getElementById('format-json-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(parsed, null, 2);
        jsonOutput.style.color = 'var(--text-main)';
    } catch (err) {
        jsonOutput.textContent = 'Error de Sintaxis JSON: ' + err.message;
        jsonOutput.style.color = 'var(--danger)';
    }
});

document.getElementById('minify-json-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(parsed);
        jsonOutput.style.color = 'var(--text-main)';
    } catch (err) {
        jsonOutput.textContent = 'Error de Sintaxis JSON: ' + err.message;
        jsonOutput.style.color = 'var(--danger)';
    }
});

document.getElementById('copy-json-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(jsonOutput.textContent);
    alert('¡Resultado copiado al portapapeles!');
});

// --- 4. PROBADOR API ---
const apiMethod = document.getElementById('api-method');
const apiUrl = document.getElementById('api-url');
const sendApiBtn = document.getElementById('send-api-btn');
const apiStatusBadge = document.getElementById('api-status-badge');
const apiTimeBadge = document.getElementById('api-time-badge');
const apiOutputPre = document.getElementById('api-output-pre');

sendApiBtn.addEventListener('click', async () => {
    const url = apiUrl.value.trim();
    if (!url) return alert('Por favor ingresa una URL válida');

    apiStatusBadge.textContent = 'Estado: Cargando...';
    apiTimeBadge.textContent = 'Tiempo: ...';
    const startTime = performance.now();

    try {
        const response = await fetch(url, { method: apiMethod.value });
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        apiStatusBadge.textContent = `Estado: ${response.status} ${response.statusText}`;
        apiStatusBadge.style.color = response.ok ? 'var(--success)' : 'var(--danger)';
        apiTimeBadge.textContent = `Tiempo: ${duration}ms`;

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            apiOutputPre.textContent = JSON.stringify(data, null, 2);
        } else {
            const text = await response.text();
            apiOutputPre.textContent = text;
        }
    } catch (err) {
        apiStatusBadge.textContent = 'Estado: Error de red o CORS';
        apiStatusBadge.style.color = 'var(--danger)';
        apiTimeBadge.textContent = 'Tiempo: -';
        apiOutputPre.textContent = err.message;
    }
});

// --- 5. LABORATORIO CSS AMPLIADO ---
const cssRadius = document.getElementById('css-radius');
const cssShadow = document.getElementById('css-shadow');
const cssRotate = document.getElementById('css-rotate');
const cssOpacity = document.getElementById('css-opacity');
const cssPadding = document.getElementById('css-padding');
const cssColor1 = document.getElementById('css-color1');
const cssColor2 = document.getElementById('css-color2');
const cssTextColor = document.getElementById('css-text-color');

const cssBoxPreview = document.getElementById('css-box-preview');
const cssCodeOutput = document.getElementById('css-code-output');

const valRadius = document.getElementById('val-radius');
const valShadow = document.getElementById('val-shadow');
const valRotate = document.getElementById('val-rotate');
const valOpacity = document.getElementById('val-opacity');
const valPadding = document.getElementById('val-padding');

function updateCSSLab() {
    const r = cssRadius.value;
    const s = cssShadow.value;
    const rot = cssRotate.value;
    const op = cssOpacity.value / 100;
    const pad = cssPadding.value;
    const c1 = cssColor1.value;
    const c2 = cssColor2.value;
    const tc = cssTextColor.value;

    valRadius.textContent = r + 'px';
    valShadow.textContent = s + 'px';
    valRotate.textContent = rot + 'deg';
    valOpacity.textContent = cssOpacity.value + '%';
    valPadding.textContent = pad + 'px';

    const bgGradient = `linear-gradient(135deg, ${c1}, ${c2})`;

    cssBoxPreview.style.borderRadius = r + 'px';
    cssBoxPreview.style.boxShadow = `0px 10px ${s}px rgba(0,0,0,0.4)`;
    cssBoxPreview.style.transform = `rotate(${rot}deg)`;
    cssBoxPreview.style.opacity = op;
    cssBoxPreview.style.padding = pad + 'px';
    cssBoxPreview.style.background = bgGradient;
    cssBoxPreview.style.color = tc;

    cssCodeOutput.value = `border-radius: ${r}px;\nbox-shadow: 0px 10px ${s}px rgba(0,0,0,0.4);\ntransform: rotate(${rot}deg);\nopacity: ${op};\npadding: ${pad}px;\nbackground: ${bgGradient};\ncolor: ${tc};`;
}

[cssRadius, cssShadow, cssRotate, cssOpacity, cssPadding, cssColor1, cssColor2, cssTextColor].forEach(el => {
    if (el) el.addEventListener('input', updateCSSLab);
});

updateCSSLab();

// --- 6. BÓVEDA DE CÓDIGO (Snippets) ---
const vaultTitle = document.getElementById('vault-title');
const vaultCode = document.getElementById('vault-code');
const saveVaultBtn = document.getElementById('save-vault-btn');
const vaultList = document.getElementById('vault-list');

let snippets = JSON.parse(localStorage.getItem('devsuite_vault')) || [];

function renderVault() {
    if (!vaultList) return;
    vaultList.innerHTML = '';
    snippets.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'vault-card';
        card.innerHTML = `
            <h4>${item.title}</h4>
            <pre>${item.code}</pre>
            <button class="btn-secondary" onclick="deleteSnippet(${index})">Eliminar</button>
        `;
        vaultList.appendChild(card);
    });
}

if (saveVaultBtn) {
    saveVaultBtn.addEventListener('click', () => {
        if (!vaultTitle.value || !vaultCode.value) return alert('Completa los campos');
        snippets.push({ title: vaultTitle.value, code: vaultCode.value });
        localStorage.setItem('devsuite_vault', JSON.stringify(snippets));
        vaultTitle.value = '';
        vaultCode.value = '';
        renderVault();
    });
}

window.deleteSnippet = function(index) {
    snippets.splice(index, 1);
    localStorage.setItem('devsuite_vault', JSON.stringify(snippets));
    renderVault();
};

renderVault();

// --- 7. REGISTRO DE PWA Y SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker registrado con éxito.'))
            .catch((err) => console.log('Error al registrar el Service Worker:', err));
    });
}

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'block';

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                deferredPrompt = null;
            });
        });
    }
});

const netStatus = document.getElementById('net-status');
function updateOnlineStatus() {
    if (!netStatus) return;
    if (navigator.onLine) {
        netStatus.textContent = '🟢 En línea';
        netStatus.style.background = 'rgba(34, 197, 94, 0.1)';
        netStatus.style.color = 'var(--success)';
    } else {
        netStatus.textContent = '🔴 Offline';
        netStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        netStatus.style.color = 'var(--danger)';
    }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// --- GESTOR MULTIPROYECTO ---
const projectTitleInput = document.getElementById('project-title-input');
const saveProjectVaultBtn = document.getElementById('save-project-vault-btn');
const projectsList = document.getElementById('projects-list');

if (saveProjectVaultBtn) {
    saveProjectVaultBtn.addEventListener('click', () => {
        const title = projectTitleInput.value.trim();
        if (!title) {
            alert('Por favor, escribe un título para el proyecto.');
            return;
        }

        files[fileSelect.value] = codeTextarea.value;
        let allProjects = JSON.parse(localStorage.getItem('devsuite_all_projects') || '{}');

        allProjects[title] = {
            'index.html': files['index.html'],
            'style.css': files['style.css'],
            'app.js': files['app.js']
        };

        localStorage.setItem('devsuite_all_projects', JSON.stringify(allProjects));
        projectTitleInput.value = '';
        loadProjectsList();
        alert(`¡Proyecto "${title}" guardado con éxito!`);
    });
}

function loadProjectsList() {
    if (!projectsList) return;
    projectsList.innerHTML = '';
    
    let allProjects = JSON.parse(localStorage.getItem('devsuite_all_projects') || '{}');
    
    if (Object.keys(allProjects).length === 0) {
        projectsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No hay proyectos guardados aún.</p>';
        return;
    }

    for (const [title, savedFiles] of Object.entries(allProjects)) {
        const card = document.createElement('div');
        card.className = 'vault-card';
        card.innerHTML = `
            <h4 style="margin-bottom: 0.5rem; color: var(--accent);">${title}</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">Contiene: index, style, app</p>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-primary load-proj-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Cargar</button>
                <button class="btn-secondary delete-proj-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: var(--danger);">Eliminar</button>
            </div>
        `;

        card.querySelector('.load-proj-btn').addEventListener('click', () => {
            files['index.html'] = savedFiles['index.html'] || files['index.html'];
            files['style.css'] = savedFiles['style.css'] || files['style.css'];
            files['app.js'] = savedFiles['app.js'] || files['app.js'];

            codeTextarea.value = files[fileSelect.value];
            updatePreview();

            navBtns.forEach(b => b.classList.remove('active'));
            tabSections.forEach(s => s.classList.remove('active'));
            
            const editorBtn = document.querySelector('[data-target="editor-section"]');
            const editorSection = document.getElementById('editor-section');
            if (editorBtn) editorBtn.classList.add('active');
            if (editorSection) editorSection.classList.add('active');

            alert(`¡Proyecto "${title}" cargado correctamente en el editor!`);
        });

        card.querySelector('.delete-proj-btn').addEventListener('click', () => {
            if (confirm(`¿Seguro que deseas eliminar el proyecto "${title}"?`)) {
                delete allProjects[title];
                localStorage.setItem('devsuite_all_projects', JSON.stringify(allProjects));
                loadProjectsList();
            }
        });

        projectsList.appendChild(card);
    }
}

loadProjectsList();

// --- LABORATORIO PYTHON COMPLETO ---
const pythonInput = document.getElementById('python-input');
const pythonOutput = document.getElementById('python-output');
const runPythonBtn = document.getElementById('run-python-btn');
const clearPythonBtn = document.getElementById('clear-python-btn');
const copyPythonBtn = document.getElementById('copy-python-btn');
const savePythonBtn = document.getElementById('save-python-btn');
const importPythonBtn = document.getElementById('import-python-btn');
const importPythonFile = document.getElementById('import-python-file');

if (runPythonBtn) {
    runPythonBtn.addEventListener('click', () => {
        const code = pythonInput.value.trim();
        if (!code) {
            pythonOutput.textContent = '>>> Error: El editor está vacío.';
            pythonOutput.style.color = 'var(--danger)';
            return;
        }

        pythonOutput.style.color = 'var(--text-main)';
        let logs = [];

        try {
            const printRegex = /print\s*\((.*?)\)/g;
            let match;
            
            while ((match = printRegex.exec(code)) !== null) {
                let evaluated = match[1].replace(/['"]/g, '');
                logs.push(evaluated);
            }

            if (logs.length > 0) {
                pythonOutput.textContent = '>>> ' + logs.join('\n>>> ');
            } else {
                pythonOutput.textContent = '>>> Código ejecutado correctamente (Sin salidas print).';
            }
        } catch (err) {
            pythonOutput.textContent = '>>> Error de ejecución: ' + err.message;
            pythonOutput.style.color = 'var(--danger)';
        }
    });
}

if (clearPythonBtn) {
    clearPythonBtn.addEventListener('click', () => {
        pythonInput.value = '';
        pythonOutput.textContent = '>>> Consola limpia.';
        pythonOutput.style.color = 'var(--text-muted)';
    });
}

if (copyPythonBtn) {
    copyPythonBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pythonOutput.textContent);
        alert('¡Salida copiada al portapapeles!');
    });
}

if (savePythonBtn) {
    savePythonBtn.addEventListener('click', () => {
        const content = pythonInput.value;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'script.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

if (importPythonBtn && importPythonFile) {
    importPythonBtn.addEventListener('click', () => {
        importPythonFile.click();
    });

    importPythonFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            pythonInput.value = event.target.result;
            alert(`¡Archivo "${file.name}" cargado en el editor de Python!`);
        };
        reader.readAsText(file);
        importPythonFile.value = '';
    });
}

// --- TUTORIALES PRECARGADOS ---
const tutorialsList = document.getElementById('tutorials-list');
const defaultTutorials = [
    { title: "Curso Completo de HTML & CSS desde Cero", url: "https://www.youtube.com/watch?v=example1" },
    { title: "JavaScript Moderno y Asíncrono para Principiantes", url: "https://www.youtube.com/watch?v=example2" },
    { title: "Cómo Crear una Progressive Web App (PWA) Paso a Paso", url: "https://www.youtube.com/watch?v=example3" },
    { title: "Aprende Python para Desarrolladores Web", url: "https://www.youtube.com/watch?v=example4" }
];

function renderTutorials() {
    if (!tutorialsList) return;
    tutorialsList.innerHTML = '';
    defaultTutorials.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'vault-card';
        card.innerHTML = `
            <h4 style="margin-bottom: 0.5rem; color: var(--accent);">${item.title}</h4>
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; font-size: 0.85rem; word-break: break-all; display: inline-block; margin-top: 0.25rem;">▶️ Ver en YouTube</a>
        `;
        tutorialsList.appendChild(card);
    });
}
renderTutorials();

// --- SIMULADOR DE TERMINAL DE CIBERSEGURIDAD AVANZADO ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim();
            if (!cmd) return;

            terminalOutput.innerHTML += `\nroot@devsuite:~# ${cmd}\n`;
            let response = simulateAdvancedCommand(cmd);
            terminalOutput.innerHTML += response;
            
            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

function simulateAdvancedCommand(command) {
    const parts = command.trim().split(' ');
    const lowerCmd = parts[0].toLowerCase();
    const arg = parts[1] || '';

    switch (lowerCmd) {
        case 'help':
            return `Comandos de red y hacking ético disponibles:
 - ifconfig / ip a       : Muestra la configuración de red simulada.
 - ping <ip/host>        : Simula envío de paquetes ICMP.
 - nmap <ip>             : Escaneo de puertos y servicios abiertos.
 - traceroute <ip>       : Rastrea la ruta de saltos de red hacia el objetivo.
 - nslookup <dominio>    : Consulta registros DNS (IPs asociadas).
 - whoami                : Muestra el usuario actual del sistema.
 - dirbuster <url>       : Simula fuzzing de directorios web ocultos.
 - hash <texto>          : Genera hashes simulados (MD5 / SHA256).
 - base64 <texto>        : Codifica texto en formato Base64.
 - clear                 : Limpia la pantalla de la terminal.\n`;

        case 'clear':
            terminalOutput.innerHTML = 'DevSuite CyberTerminal v2.5 (Secure Sandbox)';
            return '';

        case 'ifconfig':
        case 'ip':
            return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::42:acff:fe11:2342  prefixlen 64  scopeid 0x20<link>
        ether 02:42:ac:11:23:42  txqueuelen 1000  (Ethernet)
        RX packets 2450  bytes 312430 (305.1 KiB)
        TX packets 1980  bytes 184400 (180.0 KiB)\n`;

        case 'ping':
            const pingTarget = arg || '127.0.0.1';
            return `PING ${pingTarget} (${pingTarget}) 56(84) bytes of data.
64 bytes from ${pingTarget}: icmp_seq=1 ttl=118 time=21.4 ms
64 bytes from ${pingTarget}: icmp_seq=2 ttl=118 time=19.8 ms
64 bytes from ${pingTarget}: icmp_seq=3 ttl=118 time=22.1 ms
--- ${pingTarget} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms\n`;

        case 'nmap':
            const nmapTarget = arg || '192.168.1.50';
            return `Starting Nmap 7.94 ( https://nmap.org ) 
Nmap scan report for ${nmapTarget}
Host is up (0.012s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql

Nmap done: 1 IP address (1 host up) scanned in 1.85 seconds\n`;

        case 'traceroute':
        case 'tracert':
            const traceTarget = arg || 'target.com';
            return `traceroute to ${traceTarget} (93.184.216.34), 30 hops max, 64 byte packets
 1  gateway (192.168.1.1)  1.124 ms  1.002 ms  0.915 ms
 2  10.20.0.1 (10.20.0.1)  14.521 ms  14.102 ms
 3  core-router-isp.net (172.16.40.1)  28.412 ms  27.985 ms
 4  ${traceTarget} (93.184.216.34)  31.204 ms  30.891 ms\n`;

        case 'nslookup':
            const dnsTarget = arg || 'ejemplo.com';
            return `Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   ${dnsTarget}
Address: 93.184.216.34
Address: 2606:2800:220:1:248:1893:25c8:1946\n`;

        case 'whoami':
            return `root (uid=0 gid=0 euid=0)\n`;

        case 'dirbuster':
        case 'gobuster':
            return `[+] Progress: 1200 / 4600 (26.08%)
[+] Found: /index.html (Status: 200)
[+] Found: /assets/ (Status: 301)
[+] Found: /login.php (Status: 200)
[+] Found: /admin/ (Status: 403)
[+] Found: /robots.txt (Status: 200)\n`;

        case 'hash':
            const textToHash = arg || 'devsuite';
            return `Texto: "${textToHash}"
MD5    : 5d41402abc4b2a76b9719d911017c592
SHA256 : 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08\n`;

        case 'base64':
            const textB64 = arg || 'HackingEtico';
            return `Codificado Base64: ${btoa(textB64)}\n`;

        default:
            return `bash: ${command}: comando no reconocido. Escribe 'help' para ver los comandos disponibles.\n`;
    }
}

// --- AUTO-ACTUALIZACIÓN DE SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('change', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Hay una nueva versión disponible, recargamos la página automáticamente
                    window.location.reload();
                }
            });
        });
    });
}