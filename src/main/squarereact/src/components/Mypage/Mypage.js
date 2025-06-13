import React, { useEffect, useState } from "react";
import PasswordChange from "./PasswordChange";
import DeleteId from "./DeleteId";
import { getBasicInfo, updatePhone, updateEmail, updateProfileImage } from "../../api/mypageApi";
import "./mypage.css";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showModal, setShowModal] = useState(false);
  const [editType, setEditType] = useState("");
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/147/147144.png";
  const [profileImg, setProfileImg] = useState(defaultImg);

  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    username: "",
    phone: "",
    email: "",
    userProfile: "",
    academyName: "", // 원장용
    childrenNames: [], // 학부모용
    subject: "", // 강사용
    className: "", // 학생용
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
          userProfile: data.userProfile,
          academyName: data.academyName,
          childrenNames: data.childrenNames,
          subject: data.subject,
          className: data.className,
        });

        setProfileImg(data.userProfile && data.userProfile.trim() !== "" 
          ? `https://kr.object.ncloudstorage.com/square/mypage/${data.userProfile}`
          : defaultImg);

      } catch (error) {
        alert("기본 정보 불러오기 실패");
      }
    }
    fetchBasicInfo();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const data = await updateProfileImage(formData);
        const imageUrl = `https://kr.object.ncloudstorage.com/square/mypage/${data.userProfile}`;
        setProfileImg(imageUrl);
        setUserInfo((prev) => ({ ...prev, userProfile: imageUrl }));
      } catch(error) {
        alert("프로필 이미지 업로드 실패");
      }
    }
  };

  const openModal = (type) => {
    setEditType(type);
    setShowModal(true);
    setModalInput("");
    setModalError("");
  };

  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const digits = value.replace(/\D/g, "");

    if (digits.length < 4) return digits;
    if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;

    return digits;
  };

  const handleModalInputChange = (e) => {
    const value = e.target.value;
    if (editType === "phone") {
      const formatted = formatPhoneNumber(value);
      setModalInput(formatted);
    } else {
      setModalInput(value);
    }
  };

  const handleSave = async () => {
    if (!modalInput) {
      setModalError("값을 입력해주세요.");
      return;
    }

    if (editType === "phone") {
      // 숫자만 추출해서 길이 검사 (10~11자리)
      const onlyDigits = modalInput.replace(/\D/g, "");
      if (!/^\d{10,11}$/.test(onlyDigits)) {
        setModalError("휴대폰 번호는 숫자만 입력하며, 10~11자리여야 합니다.");
        return;
      }
    }

    if (editType === "email") {
      // 간단 이메일 유효성 검사
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(modalInput)) {
        setModalError("올바른 이메일 형식이 아닙니다.");
        return;
      }
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
                    <img src={profileImg} alt={defaultImg} />
                    <label className="btn-photo">
                      사진 변경
                      <input type="file" hidden onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="info-line">
                    <div className="info-label">이름</div>
                    <div className="info-value">{userInfo.name}</div>
                  </div>

                  {/* 역할별 정보 */}
                  {userInfo.role === "원장" && (
                    <div className="info-line">
                      <div className="info-label">학원이름</div>
                      <div className="info-value">{userInfo.academyName || "학원이름 없음"}</div>
                    </div>
                  )}

                  {userInfo.role === "학부모" && (
                    <div className="info-line">
                      <div className="info-label">자녀</div>
                      <div className="info-value">
                        {userInfo.childrenNames?.length > 0
                          ? userInfo.childrenNames.join(", ")
                          : "자녀 정보 없음"}
                      </div>
                    </div>
                  )}

                  {userInfo.role === "강사" && (
                    <div className="info-line">
                      <div className="info-label">담당 과목</div>
                      <div className="info-value">{userInfo.subject || "과목 정보 없음"}</div>
                    </div>
                  )}

                  {userInfo.role === "학생" && (
                    <div className="info-line">
                      <div className="info-label">소속 클래스</div>
                      <div className="info-value">{userInfo.className || "없음"}</div>
                    </div>
                  )}

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
              type="text"
              placeholder="입력해주세요"
              value={modalInput}
              onChange={handleModalInputChange}
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
