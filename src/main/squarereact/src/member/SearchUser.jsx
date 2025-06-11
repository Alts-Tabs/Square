import React, { useState } from 'react';
import bgImg from "../image/background.png";
import logo from "../image/SquareLogo.png";
import './searchUser.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchUser = () => {
  const navi = useNavigate();
  const [mode, setMode] = useState('username');

  // 공통 입력값
  const [form, setForm] = useState({ name: '', email: '', username: '' });

  // 결과 및 상태
  const [result, setResult] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ name: '', email: '', username: '' });
    setResult('');
    setShowResetPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  }

  const handleFindUsername = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/public/find-username', {
        name: form.name, email: form.email
      });
      setResult(`✅ 아이디는 "${res.data.username}" 입니다.`);
    } catch {
      setResult('❌ 일치하는 회원 정보를 찾을 수 없습니다.');
    }
  }
  
  const handleFindPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/public/verify-user', {
        username: form.username, email: form.email
      });
      setResult('✅ 사용자 인증 성공.');
      setShowResetPassword(true);
    } catch {
      setResult('❌ 아이디와 이메일이 일치하지 않습니다.');
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if(newPassword !== confirmPassword) {
      setPasswordError('❌ 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('/public/reset-password', {
        username: form.username, newPassword: newPassword
      });
      navi("/login");
    } catch {
      setResult('❌ 비밀번호 변경에 실패했습니다.');
    }
  }

  return (
    <div className="backstyle fade-in" style={{backgroundImage: `url(${bgImg})`}}>
      <img alt="" src={logo} className="logo" onClick={() => navi("/login")} />
      <div className='searchUser-box'>
        <h2>{mode === 'username' ? '아이디 찾기' : '비밀번호 찾기'}</h2>
        {!showResetPassword && (
        <form onSubmit={mode === 'username' ? handleFindUsername : handleFindPassword}>
          {mode === 'username' && 
            <input type='text' placeholder='사용자 이름'
             className='form-control inputs'
             name='name' value={form.name} onChange={handleChange} required />
          }
          {mode === 'password' && 
            <input type='text' placeholder='아이디'
             className='form-control inputs'
             name='username' value={form.username} onChange={handleChange} required />
          }
          <input type='email' name='email' placeholder='이메일'
           className='form-control inputs'
           value={form.email} onChange={handleChange} required />

          <button type='submit'>{mode === 'username' ? '아이디 찾기' : '비밀번호 찾기'}</button>
        </form>
        )}

        {showResetPassword &&(
          <form onSubmit={handleResetPassword}>
            <label>새 비밀번호</label>
            <input type="password" value={newPassword}
             className='form-control inputs'
             onChange={e => setNewPassword(e.target.value)}
             required />
            
            <label>비밀번호 확인</label>
            <input type="password" value={confirmPassword}
             className='form-control inputs'
             onChange={e => setConfirmPassword(e.target.value)}
             required />
            {passwordError && <p style={{color: '#D85858'}}>{passwordError}</p>}
            <button type='submit'>비밀번호 재설정</button>
          </form>
        )}
        <div className='searchUser-modebox'>
          <button onClick={() => switchMode('username')}>아이디 찾기</button>
          <button onClick={() => switchMode('password')}>비밀번호 찾기</button>
        </div>

        {result && <p style={{marginTop: '10px'}}>{result}</p>}
      </div>
    </div>
  );
};

export default SearchUser;