import React, { useState } from "react";
import './mypage.css';

const PasswordChange = () => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [error, setError] = useState("");

  // 눈 아이콘 토글용 (필드별로 개별 상태)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const validatePassword = (pw) => {
    return pw.length >= 6 && pw.length <= 12 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);
  };

  const handleSubmit = () => {
    if (!currentPw || !newPw || !checkPw) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (!validatePassword(newPw)) {
      setError("비밀번호는 6~12자 영문/숫자를 포함해야 합니다.");
      return;
    }

    if (newPw !== checkPw) {
      setError("변경할 비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    console.log("비밀번호 변경 요청:", { currentPw, newPw });

    alert("비밀번호가 성공적으로 변경되었습니다!");
    setCurrentPw("");
    setNewPw("");
    setCheckPw("");
    setShowCurrent(false);
    setShowNew(false);
    setShowCheck(false);
  };

  return (
    <div className="password-change-container">
      <h2 className="pw-title">비밀번호 변경</h2>

      <div className="shadow-box pw-box">
        {/* 현재 비밀번호 */}
        <div className="pw-field">
          <label>현재 비밀번호</label>
          <div className="pw-input-wrapper">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowCurrent(!showCurrent)}>
              <i className={`bi ${showCurrent ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </span>
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div className="pw-field">
          <label>비밀번호 변경</label>
          <div className="pw-input-wrapper">
            <input
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
              <i className={`bi ${showNew ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </span>
          </div>
          <div className="pw-hint">영문/숫자 포함 6~12자 입력해주세요.</div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="pw-field">
          <label>변경한 비밀번호 확인</label>
          <div className="pw-input-wrapper">
            <input
              type={showCheck ? "text" : "password"}
              value={checkPw}
              onChange={(e) => setCheckPw(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowCheck(!showCheck)}>
              <i className={`bi ${showCheck ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
            </span>
          </div>
        </div>

        {error && <div className="pw-error">{error}</div>}

        <button className="pw-btn" onClick={handleSubmit}>비밀번호 변경</button>
      </div>
    </div>
  );
};

export default PasswordChange;
