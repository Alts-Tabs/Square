import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 상담 예약 챗봇입니다. "상담 예약"이라고 입력하여 예약을 시작하세요.', isBot: true },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: ''
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: '',
    username: '',
    acaId: '',
    userId: ''
  });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/public/user', { withCredentials: true });
        const { name, role, username, acaId, userId } = response.data;
        setUserInfo({ name, role, username, acaId, userId });
      } catch (error) {
        console.error('User Info Error:', error);
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    };

    fetchUserInfo();
    scrollToBottom();
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, isBot) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, isBot }]);
  };

  // 수정: 날짜와 시간 형식 검증
  const validateDateTime = (date, time) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    if (!dateRegex.test(date)) {
      addMessage('날짜 형식이 올바르지 않습니다. 예: 2025-05-30', true);
      return false;
    }
    if (!timeRegex.test(time)) {
      addMessage('시간 형식이 올바르지 않습니다. 예: 14:30', true);
      return false;
    }

    const dateTimeStr = `${date}T${time}:00`;
    const dateTime = new Date(dateTimeStr);
    return dateTime > new Date();
  };

  const handleBookingStart = () => {
    setIsBooking(true);
    addMessage('상담 예약을 시작합니다. 원하시는 날짜를 입력해주세요. (예: 2025-05-30)', true);
  };

  const handleBookingComplete = async () => {
    if (!bookingData.date || !bookingData.time) {
      addMessage('날짜와 시간을 모두 입력해주세요.', true);
      return;
    }

    if (!validateDateTime(bookingData.date, bookingData.time)) {
      setIsBooking(false);
      setBookingData({ date: '', time: '' });
      return;
    }

    try {
      setIsLoading(true);
      const consultationDateTime = `${bookingData.date}T${bookingData.time}:00`;

      await axios.post(
        '/api/consultation',
        { consultationDateTime },
        { withCredentials: true }
      );

      addMessage(`상담 예약이 완료되었습니다! (${bookingData.date} ${bookingData.time})`, true);
      setIsBooking(false);
      setBookingData({ date: '', time: '' });
    } catch (error) {
      console.error('Booking Error:', error);
      addMessage('예약 중 오류가 발생했습니다. 다시 시도해주세요.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    try {
      setIsLoading(true);
      addMessage(trimmedInput, false);
      setInputText('');

      if (isBooking) {
        if (!bookingData.date) {
          setBookingData({ ...bookingData, date: trimmedInput });
          addMessage(`날짜: ${trimmedInput}\n원하시는 시간을 입력해주세요. (예: 14:30)`, true);
        } else if (!bookingData.time) {
          setBookingData({ ...bookingData, time: trimmedInput });
          addMessage(
            `예약 정보 확인:\n` +
            `날짜: ${bookingData.date}\n` +
            `시간: ${trimmedInput}\n` +
            `예약을 완료하시겠습니까? (예/아니오)`, 
            true
          );
        } else if (trimmedInput.toLowerCase() === '예') {
          await handleBookingComplete();
        } else {
          addMessage('예약이 취소되었습니다. 다시 시작하려면 "상담 예약"이라고 입력해주세요.', true);
          setIsBooking(false);
          setBookingData({ date: '', time: '' });
        }
      } else {
        if (trimmedInput.includes('상담 예약') || trimmedInput.includes('예약')) {
          handleBookingStart();
        } else {
          // Clova Chatbot API 호출
          const response = await axios.post(
            '/public/api/chatbot',
            { message: trimmedInput },
            { withCredentials: true }
          );
          addMessage(response.data, true);
        }
      }
    } catch (error) {
      console.error('ChatBot Error:', error);
      const errorMessage =
        error.response?.status === 401
          ? '인증이 만료되었습니다. 다시 로그인해주세요.'
          : error.response?.data?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      addMessage(errorMessage, true);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbotMainContainer">
      <div className="chatbotMainTitle">챗봇 상담</div>
      {userInfo.name && (
        <div className="userGreeting">환영합니다, {userInfo.name}님!</div>
      )}
      <div className="chatbotMessagesContainer">
        {messages.map((message) => (
          <div key={message.id} className={`chatMessage ${message.isBot ? 'bot' : 'user'}`}>
            {message.isBot && <div className="botIcon">🤖</div>}
            <div className="messageContent">{message.text}</div>
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
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isBooking ? 
            (bookingData.date ? 
              (bookingData.time ? 
                "예약을 완료하시겠습니까? (예/아니오)" : 
                "원하시는 시간을 입력해주세요 (예: 14:30)") : 
              "원하시는 날짜를 입력해주세요 (예: 2025-05-30)") : 
            "메시지를 입력하세요..."}
          className="chatbotInput"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="chatbotSendButton"
          disabled={isLoading || !inputText.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;