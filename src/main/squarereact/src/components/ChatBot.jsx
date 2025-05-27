import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const newMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    // 봇 응답 메시지
    const botResponse = {
      text: `안녕하세요! "${inputMessage}"에 대한 답변입니다.`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage, botResponse]);
    setInputMessage('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI 챗봇</h2>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        ))}
      </div>

      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatBot; 