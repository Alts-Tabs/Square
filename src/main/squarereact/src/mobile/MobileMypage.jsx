import React, { useEffect, useState } from 'react';
import "./mobileMypage.css";
import { getBasicInfo } from '../api/mypageApi';

const MobileMypage = () => {
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

    return (
        <div className='mobile-mypage-container'>
            <div className='m-mypage-title'>
                <h3 className='m-my-title'>마이페이지</h3>
            </div>

        
            <div className='m-mypage-contents-container'>
              <div className='m-info-box1'>
                <h3 className='m-info-title'>기본 정보</h3>
                <div className='m-profile-section'>
                    <img src={profileImg} alt={defaultImg}/>
                </div>
                <div className='m-info-line'>
                    <div className='m-info-label'>이름</div>
                    <div className='m-info-value'>{userInfo.name}</div>
                </div>
            

            {userInfo.role === "원장" && (
            <div className="m-info-line">
                <div className="m-info-label">학원이름</div>
                <div className="m-info-value">{userInfo.academyName || "학원이름 없음"}</div>
            </div>
            )}  

            {userInfo.role==="학부모" && (
            <div className='m-info-line'>
                <div className='m-info-label'>자녀</div>
                <div className='m-info-value'>
                    {userInfo.childrenNames?.length > 0 
                    ? userInfo.childrenNames.join(',')
                    : "자녀 정보 없음"}
                </div>
            </div>
            )}  

            {userInfo.role==="강사" && (
            <div className='m-info-line'>
                <div className='m-info-label'>담당 과목</div>
                <div className='m-info-value'>{userInfo.subject|| "과목 정보 없음"}</div>
            </div>
            )}

            {userInfo==="학생" && (
            <div className='m-info-line'>
                <div className='m-info-label'>소속 클래스</div>
                <div className='m-info-value'>{userInfo.className || "없음"}</div>
            </div>
            )}

            <div className='m-info-line'>
                <div className='m-info-label'>회원 등급</div>
                <div className='m-info-value'>{userInfo.role}</div>
            </div>
          </div>

            <div className='m-info-box2'>
                <h3 className='m-info-title'>계정 정보</h3>
                
                <div className='m-info-line'>
                    <div className='m-info-label'>아이디</div>
                    <div className='m-info-value'>{userInfo.username}</div>
                </div>

                <div className='m-info-line'>
                    <div className='m-info-label'>휴대폰 번호</div>
                    <div className='m-info-value'>{userInfo.phone}</div>
                </div>

                <div className='m-info-line'>
                    <div className='m-info-label'>이메일</div>
                    <div className='m-info-value'>{userInfo.email}</div>
                </div>                
            </div>
            </div> {/*.m-mypage-contents-container 끝 */}
        </div>
    );
};

export default MobileMypage;