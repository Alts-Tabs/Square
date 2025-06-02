import React, { useState } from "react";
import './mypage.css';

const ContactEditModal = ({ onClose, onSave }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onSave({ phone, email });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>연락처 변경</h3>

        <label>휴대폰 번호</label>
        <input
          type="text"
          placeholder="010-xxxx-xxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default ContactEditModal;
