// src/components/DeleteId.js
import React, { useState } from "react";

const DeleteId = () => {
  const [withdrawPw, setWithdrawPw] = useState("");
  const [withdrawCheck, setWithdrawCheck] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  const handleWithdrawal = () => {
    if (!withdrawCheck) {
      setWithdrawError("위 사항을 모두 확인해주세요.");
      return;
    }
    if (!withdrawPw) {
      setWithdrawError("비밀번호를 입력해주세요.");
      return;
    }
    if (withdrawPw !== "correct_password") {
      // 실제 비밀번호 확인 로직 필요
      setWithdrawError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setWithdrawError("");
    alert("회원 탈퇴가 완료되었습니다.");
    // TODO: 탈퇴 처리 서버 연동 후 로그아웃 처리
  };

  return (
    <div className="deleteid-card">
      <h3 className="info-title">회원 탈퇴</h3>
      <p className="withdrawal-warning">
        ⚠️ 회원 탈퇴 전 꼭 확인해주세요.
        <br />
        탈퇴 시, 일정, 출결 기록, 숙제 정보 등 모든 데이터가 삭제되며
        복구가 불가능합니다.
        <br />
        탈퇴 후에는 동일한 이메일로 재가입하더라도 이전 데이터는
        연결되지 않습니다.
      </p>

      <label className="withdrawal-check">
        <input
          type="checkbox"
          checked={withdrawCheck}
          onChange={(e) => setWithdrawCheck(e.target.checked)}
        />
        위 사항을 모두 확인했습니다.
      </label>

      <div className="pw-field">
        <label>현재 비밀번호 입력</label>
        <input
          type="password"
          value={withdrawPw}
          onChange={(e) => setWithdrawPw(e.target.value)}
        />
      </div>

      {withdrawError && (
        <div className="pw-error" style={{ marginBottom: "10px" }}>
          {withdrawError}
        </div>
      )}

      <button className="pw-btn" onClick={handleWithdrawal}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default DeleteId;