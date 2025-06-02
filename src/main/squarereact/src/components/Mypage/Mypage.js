import React, { useEffect, useState } from "react";
import PasswordChange from "./PasswordChange";
import DeleteId from "./DeleteId";
import { getBasicInfo, updatePhone, updateEmail } from "../../api/mypageApi";
import "./mypage.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showModal, setShowModal] = useState(false);
  const [editType, setEditType] = useState("");
  const [profileImg, setProfileImg] = useState(
    "https://cdn-icons-png.flaticon.com/512/147/147144.png"
  );

  const [userInfo, setUserInfo] = useState({
    name: "",
    birthDate: "",
    role: "",
    username: "",
    phone: "",
    email: "",
  });

  const [modalInput, setModalInput] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    async function fetchBasicInfo() {
      try {
        const data = await getBasicInfo();
        setUserInfo({
          name: data.name,
          birthDate: data.birthDate,
          role: data.role,
          username: data.username,
          phone: data.phone,
          email: data.email,
        });
      } catch (error) {
        alert("기본 정보 불러오기 실패");
      }
    }
    fetchBasicInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setProfileImg(preview);
    }
  };

  const openModal = (type) => {
    setEditType(type);
    setShowModal(true);
    setModalInput("");
    setModalError("");
  };

  const handleSave = async () => {
    if (!modalInput) {
      setModalError("값을 입력해주세요.");
      return;
    }
    try {
      if (editType === "phone") {
        await updatePhone(modalInput);
        setUserInfo((prev) => ({ ...prev, phone: modalInput }));
        alert("휴대폰 번호가 변경되었습니다.");
      } else if (editType === "email") {
        await updateEmail(modalInput);
        setUserInfo((prev) => ({ ...prev, email: modalInput }));
        alert("이메일이 변경되었습니다.");
      }
      setShowModal(false);
    } catch (error) {
      alert("변경에 실패했습니다.");
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-wrapper">
        <aside className="mypage-sidebar">
          <nav>
            <div
              className={activeTab === "basic" ? "menu-active" : "menu"}
              onClick={() => setActiveTab("basic")}
            >
              기본 정보
            </div>
            <div
              className={activeTab === "password" ? "menu-active" : "menu"}
              onClick={() => setActiveTab("password")}
            >
              비밀번호 변경
            </div>
            <div
              className={activeTab === "withdrawal" ? "menu-active" : "menu"}
              onClick={() => setActiveTab("withdrawal")}
            >
              회원 탈퇴
            </div>
          </nav>
        </aside>

        <main className="mypage-content">
          <h2 className="mypage-title">마이페이지</h2>

          {activeTab === "basic" && (
            <div className="mypage-card shadow-box">
              <div className="mypage-grid">
                <div className="info-box">
                  <h3 className="info-title">기본 정보</h3>
                  <div className="profile-section">
                    <img src={profileImg} alt="프로필" />
                    <label className="btn-photo">
                      사진 변경
                      <input type="file" hidden onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="info-line">
                    <div className="info-label">이름</div>
                    <div className="info-value">{userInfo.name}</div>
                  </div>
                  <div className="info-line">
                    <div className="info-label">생년월일</div>
                    <div className="info-value">{userInfo.birthDate}</div>
                  </div>
                  <div className="info-line">
                    <div className="info-label">회원 등급</div>
                    <div className="info-value">{userInfo.role}</div>
                  </div>
                </div>

                <div className="info-box">
                  <h3 className="info-title">계정 정보</h3>
                  <div className="info-line">
                    <div className="info-label">아이디</div>
                    <div className="info-value">{userInfo.username}</div>
                  </div>
                  <div className="info-line">
                    <div className="info-label">휴대폰 번호</div>
                    <div className="info-value">
                      {userInfo.phone}
                      <button
                        className="btn-edit"
                        onClick={() => openModal("phone")}
                      >
                        변경
                      </button>
                    </div>
                  </div>
                  <div className="info-line">
                    <div className="info-label">이메일</div>
                    <div className="info-value">
                      {userInfo.email}
                      <button
                        className="btn-edit"
                        onClick={() => openModal("email")}
                      >
                        변경
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && <PasswordChange />}
          {activeTab === "withdrawal" && <DeleteId />}
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editType === "phone" ? "휴대폰 번호 변경" : "이메일 변경"}</h3>
            <label>{editType === "phone" ? "새 휴대폰 번호" : "새 이메일"}</label>
            <input
              type={editType === "phone" ? "text" : "email"}
              placeholder="입력해주세요"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
            />
            {modalError && <div className="pw-error">{modalError}</div>}
            <div className="modal-buttons">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
