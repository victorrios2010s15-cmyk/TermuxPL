// --- 1. NAVEGACIÓN ENTRE PESTAÑAS ---
const navBtns = document.querySelectorAll('.nav-btn');
const tabSections = document.querySelectorAll('.tab-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        tabSections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        const targetSection = document.getElementById(btn.dataset.target);
        targetSection.classList.add('active');
    });
});

// --- 2. EDITOR DE CÓDIGO & PREVIEW ---
const codeTextarea = document.getElementById('code-textarea');
const livePreview = document.getElementById('live-preview');
const fileSelect = document.getElementById('file-select');

// Almacén básico local en memoria para los archivos
const files = {
    'index.html': '<h1>¡Hola Mundo!</h1>\n<p>Edita este código y mira el resultado en tiempo real.</p>',
    'style.css': 'body { font-family: sans-serif; text-align: center; margin-top: 50px; background: #f0f0f0; }',
    'app.js': 'console.log("DevSuite Activo");'
};

// Cargar archivo seleccionado
fileSelect.addEventListener('change', (e) => {
    codeTextarea.value = files[e.target.value];
});

// Cargar inicial
codeTextarea.value = files['index.html'];

// Actualizar previsualización en vivo
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
updatePreview(); // Ejecutar al inicio

document.getElementById('save-file-btn').addEventListener('click', () => {
    localStorage.setItem('devsuite_files', JSON.stringify(files));
    alert('¡Archivos guardados en el almacenamiento local!');
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

// --- 5. LABORATORIO CSS ---
const cssRadius = document.getElementById('css-radius');
const cssShadow = document.getElementById('css-shadow');
const cssColor = document.getElementById('css-color');
const cssBoxPreview = document.getElementById('css-box-preview');
const cssCodeOutput = document.getElementById('css-code-output');
const valRadius = document.getElementById('val-radius');
const valShadow = document.getElementById('val-shadow');

function updateCSSLab() {
    const r = cssRadius.value;
    const s = cssShadow.value;
    const c = cssColor.value;

    valRadius.textContent = r + 'px';
    valShadow.textContent = s + 'px';

    cssBoxPreview.style.borderRadius = r + 'px';
    cssBoxPreview.style.boxShadow = `0px 10px ${s}px rgba(0,0,0,0.4)`;
    cssBoxPreview.style.backgroundColor = c;

    cssCodeOutput.value = `border-radius: ${r}px;\nbox-shadow: 0px 10px ${s}px rgba(0,0,0,0.4);\nbackground-color: ${c};`;
}

cssRadius.addEventListener('input', updateCSSLab);
cssShadow.addEventListener('input', updateCSSLab);
cssColor.addEventListener('input', updateCSSLab);
updateCSSLab();

// --- 6. BÓVEDA DE CÓDIGO (Snippets) ---
const vaultTitle = document.getElementById('vault-title');
const vaultCode = document.getElementById('vault-code');
const saveVaultBtn = document.getElementById('save-vault-btn');
const vaultList = document.getElementById('vault-list');

let snippets = JSON.parse(localStorage.getItem('devsuite_vault')) || [];

function renderVault() {
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

saveVaultBtn.addEventListener('click', () => {
    if (!vaultTitle.value || !vaultCode.value) return alert('Completa los campos');
    snippets.push({ title: vaultTitle.value, code: vaultCode.value });
    localStorage.setItem('devsuite_vault', JSON.stringify(snippets));
    vaultTitle.value = '';
    vaultCode.value = '';
    renderVault();
});

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

// Capturar evento de instalación de la PWA
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar la PWA');
            }
            deferredPrompt = null;
        });
    });
});

// Control de estado de red (Online / Offline)
const netStatus = document.getElementById('net-status');

function updateOnlineStatus() {
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