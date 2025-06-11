import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatbotPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 안전하게 객체를 문자열로 변환
function safeStringify(obj) {
  try {
    if (obj instanceof Error) {
      const errorObj = {};
      Object.getOwnPropertyNames(obj).forEach((key) => {
        errorObj[key] = obj[key];
      });
      return JSON.stringify(errorObj);
    }
    const str = JSON.stringify(obj);
    if (!str || str === '{}' || str === '[]') {
      return "응답을 파싱할 수 없습니다.";
    }
    return str;
  } catch {
    return "응답을 파싱할 수 없습니다.";
  }
}

// 챗봇 응답에서 텍스트 및 버튼 추출
const extractBotText = (resp) => {
  if (!resp) return { text: "응답이 없습니다.", buttons: [] };

  if (resp.error) return { text: resp.error, buttons: [] };

  if (typeof resp === 'object' && resp !== null) {
    if (resp.text && resp.text.trim()) {
      return { text: resp.text.trim(), buttons: resp.buttons || [] };
    }
    if (resp.data?.cover?.data?.description && resp.data.cover.data.description.trim()) {
      return { text: resp.data.cover.data.description.trim(), buttons: resp.buttons || [] };
    }
    return { text: safeStringify(resp), buttons: [] };
  }

  if (typeof resp === 'string') {
    try {
      const obj = JSON.parse(resp);
      if (obj.error) return { text: obj.error, buttons: [] };
      if (obj.text && obj.text.trim()) return { text: obj.text.trim(), buttons: obj.buttons || [] };
      if (obj.data?.cover?.data?.description && obj.data.cover.data.description.trim()) {
        return { text: obj.data.cover.data.description.trim(), buttons: obj.buttons || [] };
      }
      return { text: safeStringify(obj), buttons: [] };
    } catch (e) {
      return { text: resp.trim() || "응답 파싱 오류", buttons: [] };
    }
  }

  return { text: safeStringify(resp) || "알 수 없는 응답 형식", buttons: [] };
};

const parseNaturalDate = (text) => {
  const now = new Date();
  const year = now.getFullYear();
  const regex = /(\d{1,2})월(\d{1,2})일\s*(오전|오후)?(\d{1,2})시/g;
  const match = regex.exec(text);

  if (!match) return null;

  const [, month, day, ampm, hour] = match;
  let hourNum = parseInt(hour, 10) || 0;
  if (ampm === '오후' && hourNum < 12) hourNum += 12;
  if (ampm === '오전' && hourNum === 12) hourNum = 0;

  const date = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10), hourNum, 0, 0);
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm" 형식
};

const ChatbotPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [consultationDate, setConsultationDate] = useState('');
  const [acaId, setAcaId] = useState('');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((text, isBot, buttons = []) => {
    const safeText = typeof text === 'string' ? text : safeStringify(text ?? '[empty]');
    setMessages((prev) => [...prev, { id: prev.length + 1, text: safeText, isBot, buttons }]);
  }, []);

  const callApi = useCallback(async (url, method = 'get', data = {}, params = {}) => {
    try {
      const response = await axios({
        method,
        url,
        data,
        params,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });      
      return response.data;
    } catch (error) {      
      throw error;
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const data = await callApi('/public/user');
      setUserInfo(data);
      setAcaId(data.acaId || '');
    } catch (error) {
      const status = error.response?.status;
      const message = status === 401 ? '인증이 만료되었습니다. 다시 로그인해주세요.' : '사용자 정보를 불러오지 못했습니다.';
      addMessage(message, true);
      if (status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [callApi, navigate, addMessage]);

  const fetchConsultations = useCallback(async () => {
    try {
      const data = await callApi('/public/api/consultation');
      setConsultations(data);
    } catch (err) {      
      addMessage('상담 목록을 불러오지 못했습니다.', true);
    }
  }, [callApi, addMessage]);

  const fetchWelcomeMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await callApi('/public/api/chatbot', 'post', { message: '' }, { eventType: 'open', acaId });
      const { text: botText, buttons } = extractBotText(data);
      addMessage(botText, true, buttons || [{ title: '상담예약', action: '상담 예약' }]);
    } catch (error) {      
      addMessage('웰컴 메시지를 불러오는 데 실패했습니다.', true);
    } finally {
      setIsLoading(false);
    }
  }, [acaId, addMessage, callApi]);

  const handleSendMessage = useCallback(
    async (messageText = inputText) => {
      const content = messageText.trim();
      if (!content) return;

      addMessage(content, false);
      setInputText('');

      try {
        setIsLoading(true);
        let formattedDate = consultationDate;

        // 자연어로 날짜 파싱 시도
        if (!formattedDate && content.match(/(\d{1,2})월(\d{1,2})일/)) {
          const parsedDate = parseNaturalDate(content);
          if (parsedDate) {
            formattedDate = parsedDate;
            setConsultationDate(parsedDate); // 상태 업데이트
            addMessage(`날짜가 ${new Date(parsedDate).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}로 설정되었습니다.`, true);
          } else {
            addMessage('날짜 형식이 올바르지 않습니다. 예: "7월2일 오전11시"', true);
            setIsLoading(false);
            return;
          }
        }

        const data = await callApi(
          '/public/api/chatbot',
          'post',
          { message: content },
          {
            acaId,
            consultationDate: formattedDate,
            eventType: 'send',
          }
        );

        const { text: botText, buttons } = extractBotText(data);
        if (formattedDate && !botText.includes('완료')) {
          const selectedDate = new Date(formattedDate).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
          addMessage(`${selectedDate}로 예약하시겠습니까?`, true, [
            { title: '네', action: '네' },
            { title: '아니오', action: '아니오' },
          ]);
        } else {
          addMessage(botText, true, buttons);
        }

        if (botText.includes('상담 예약이 완료되었습니다')) {
          await fetchConsultations();
        }
      } catch (error) {        
        const status = error.response?.status;
        const errorMessage = status === 401
          ? '인증이 만료되었습니다. 다시 로그인해주세요.'
          : error.response?.data?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        addMessage(errorMessage, true);
        if (status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, consultationDate, acaId, addMessage, callApi, navigate, fetchConsultations]
  );

  const handleButtonClick = useCallback(
    (action) => {
      if (action === '상담 예약') {
        addMessage('날짜 및 시간 선택 후 예약 확인으로 답변 부탁드립니다.', true);
        return;
      } else if (action === '네' || action === '아니오') {
        handleSendMessage(action);
      } else if (new Date(action).toString() !== 'Invalid Date') {
        setConsultationDate(action);
        handleSendMessage(action);
      } else {
        handleSendMessage(action);
      }
    },
    [handleSendMessage, consultationDate]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    fetchUserInfo();
    fetchConsultations();
  }, [fetchUserInfo, fetchConsultations]);

  useEffect(() => {
    if (userInfo) {
      fetchWelcomeMessage();
    }
  }, [userInfo, fetchWelcomeMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="chatbotMainContainer">
      <div className="chatbotMainTitle">챗봇 상담</div>
      {userInfo?.name && <div className="userGreeting">환영합니다, {userInfo.name}님!</div>}
      <div className="chatbotMessagesContainer">
        {messages.map((msg) => (
          <div key={msg.id} className={`chatMessage ${msg.isBot ? 'bot' : 'user'}`}>
            {msg.isBot && <div className="botIcon">🤖</div>}
            <div className="messageContent">
              {msg.text}
              {msg.buttons?.length > 0 && (
                <div className="buttonContainer">
                  {msg.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="chatbotButton"
                      onClick={() => handleButtonClick(button.action)}
                    >
                      {button.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chatMessage bot">
            <div className="botIcon">🤖</div>
            <div className="messageContent typing-indicator">답변 작성 중...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbotInputContainer">
        <input
          type="datetime-local"
          value={consultationDate}
          onChange={(e) => setConsultationDate(e.target.value)}
          className="chatbotDateInput"
          placeholder="상담 날짜를 선택하세요"
        />
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요."
          className="chatbotInput"
          disabled={isLoading}
        />
        <button
          className="chatbotSendButton"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;