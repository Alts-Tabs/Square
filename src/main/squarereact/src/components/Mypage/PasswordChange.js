import React, { useState } from "react";
import './mypage.css';

const PasswordChange = () => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [error, setError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const validatePassword = (pw) => {
    return pw.length >= 6 && pw.length <= 12 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);
  };

  const handleSubmit = async () => {
    const trimmedCurrent = currentPw.trim();
    const trimmedNew = newPw.trim();
    const trimmedCheck = checkPw.trim();

    if (!trimmedCurrent || !trimmedNew || !trimmedCheck) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (!validatePassword(trimmedNew)) {
      setError("비밀번호는 6~12자 영문/숫자를 포함해야 합니다.");
      return;
    }

    if (trimmedNew !== trimmedCheck) {
      setError("변경할 비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/mypage/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: trimmedCurrent,
          newPassword: trimmedNew,
          confirmPassword: trimmedCheck, // ✅ confirmPassword 추가
        }),
      });

      if (res.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다!");
        setCurrentPw("");
        setNewPw("");
        setCheckPw("");
        setShowCurrent(false);
        setShowNew(false);
        setShowCheck(false);
      } else {
        const msg = await res.text();
        setError(msg || "비밀번호 변경 실패");
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="password-change-container">
      <h2 className="pw-title">비밀번호 변경</h2>

      <div className="shadow-box pw-box">
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
