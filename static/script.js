const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pregunta = userInput.value.trim();
  if (!pregunta) return;

  appendMessage('Tú', pregunta, 'user');
  userInput.value = '';

  const loadingId = appendMessage('Asistente', 'Analizando consulta...', 'bot loading');

  try {
    const res = await fetch('/api/consultar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta })
    });
    const data = await res.json();
    
    document.getElementById(loadingId)?.remove();

    if (data.respuesta) {
      appendMessage('Asistente', data.respuesta, 'bot');
    } else {
      appendMessage('Error', data.error || 'No se obtuvo respuesta', 'bot');
    }
  } catch (err) {
    document.getElementById(loadingId)?.remove();
    appendMessage('Error', 'Error de conexión con el servidor', 'bot');
  }
});

function appendMessage(sender, text, type) {
  const msgId = 'msg-' + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', ...type.split(' '));
  msgDiv.id = msgId;
  
  if (type.includes('user')) {
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${escapeHTML(text)}`;
  } else {
    let formattedText = text.replace(/```(bash|sh|python|javascript)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code.trim();
      return `<pre><code>${escapeHTML(cleanCode)}</code><button class="btn-copy" onclick="copiarCodigo(this)">Copiar</button></pre>`;
    });
    msgDiv.innerHTML = `<strong>${sender}:</strong><br><br>${formattedText}`;
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgId;
}

function copiarCodigo(btn) {
  const code = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerText = '¡Copiado!';
    setTimeout(() => btn.innerText = 'Copiar', 2000);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

