from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)  

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

lista_mensagens = [
    {
        "role": "system",
        "content": (
            "Você é um assistente virtual corporativo da empresa Taurus, "
            "focado em ajudar com tarefas administrativas, organização de planilhas, "
            "comunicação interna e explicações técnicas simples para não especialistas. "
            "Seja sempre educado, eficiente e extremamente claro. Evite termos técnicos quando possível."
        )
    }
]

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    pergunta = data.get("pergunta")
    if not pergunta:
        return jsonify({"erro": "Pergunta não enviada"}), 400

    lista_mensagens.append({"role": "user", "content": pergunta})

    resposta = client.chat.completions.create(
        model = "llama-3.3-70b-versatile",
        messages = lista_mensagens
    )

    resposta = resposta.choices[0].message.content
    lista_mensagens.append({"role": "assistant", "content": resposta})

    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(debug=True)
# 