import os
from flask import Flask, render_template, request, jsonify
from google import genai

app = Flask(__name__)

# La API Key se tomará de las variables seguras de la nube (Render)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
Eres un asistente técnico especializado en administración de sistemas Linux, uso de Termux y ciberseguridad defensiva (Sombrero Blanco).
Tu objetivo es ayudar al usuario a administrar sus redes locales, asegurar sus servidores y aprender sintaxis de comandos y programación.

REGLAS ESTRICTAS DE RESPUESTA:
1. Proporciona de inmediato el bloque de código o comando exacto en formato markdown (ej: ```bash).
2. Explica brevemente en 1-2 oraciones dónde pegarlo (ej: "Ejecuta esto en Termux").
3. Desglosa los parámetros clave del comando para que el usuario entienda qué hace cada bandera.
4. Concéntrate exclusivamente en tareas defensivas, auditoría de código propio, administración y aprendizaje técnico.
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/consultar', methods=['POST'])
def consultar():
    data = request.get_json()
    pregunta = data.get('pregunta', '')

    if not pregunta:
        return jsonify({'error': 'La consulta no puede estar vacía'}), 400

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=f"{SYSTEM_PROMPT}\n\nPregunta del usuario: {pregunta}"
        )
        return jsonify({'respuesta': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

