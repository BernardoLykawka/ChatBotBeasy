import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import "./Chatbotstyles.css";
import logoTaurus from "../../assets/taurus.png";

export default function Chatbot() {
  const [mensagem, setMensagem] = useState("");
  const [respostas, setRespostas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const enviarPergunta = async () => {
    if (!mensagem.trim() || isLoading) return;

    setIsLoading(true);
    setErro(null);

    try {
      const novaPergunta = { autor: "Você", texto: mensagem };
      setRespostas(prev => [...prev, novaPergunta]);
      setMensagem("");

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: mensagem }),
      });

      if (!response.ok) {
        throw new Error("Erro ao comunicar com o servidor");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.erro);
      }

      setRespostas(prev => [
        ...prev,
        { autor: "TaurusBot", texto: data.resposta }
      ]);
    } catch (error) {
      setErro("Ocorreu um erro inesperado!");
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-chatbot">
      <div className="header">
        <img src={logoTaurus} alt="Logo Taurus" className="logo" />
        <h1 className="text-header">TaurusBot</h1>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {respostas.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.autor === "Você" ? "message-user" : "message-bot"}`}
            >
              <div className="message-author">{msg.autor}:</div>
              <div className="message-text">
                <ReactMarkdown>{msg.texto}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="loading-indicator">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Pensando...
            </div>
          )}
          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

        </div>
        <div className="input-container">
          <input type="text"
            className="chat-input"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarPergunta()}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
          />
          <button
            onClick={enviarPergunta}
            className={`send-button ${isLoading ? "send-button-disabled" : "send-button-enabled"}`}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
} 