import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPage.css';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 무엇을 도와드릴까요? 24시간 언제든지 상담 가능합니다!', isBot: true },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: inputText,
      isBot: false
    }]);

    // 챗봇 응답 시뮬레이션
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: '죄송합니다. 현재 점검 중입니다. 잠시 후 다시 시도해주세요.',
        isBot: true
      }]);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbotMainContainer">      
      <div className="chatbotMainTitle">
        챗봇 상담
      </div>            
      <div className="chatbotMessagesContainer">
        {messages.map((message) => (
          <div key={message.id} className={`chatMessage ${message.isBot ? 'bot' : 'user'}`}>
            {message.isBot && (<div className="botIcon">🤖</div>)}
            <div className="messageContent">
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>      
      <div className="chatbotInputContainer">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="chatbotInput"
        />
        <button onClick={handleSendMessage} className="chatbotSendButton">
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage; 