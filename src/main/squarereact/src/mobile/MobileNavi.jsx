import React, { useEffect, useState } from 'react';
import whale_L from '../image/whale_L.png';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './mobileNavi.css';
import axios from 'axios';

const MobileNavi = () => {
  const navi = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }
  
  //현재 경로 감지 -> 변화시 메뉴 닫기
  const location = useLocation(); 
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  const [userInfo, setUserInfo] = useState({name: '', role: '', username: '', acaId: '', userId: '', roleId: '', academyName: ''});
    useEffect(() => {
      // 페이지 로드 시 사용자 정보 요청
      axios.get("/public/user", {withCredentials: true})
        .then(res => {
            const {name, role, username, acaId, userId, roleId, academyName} = res.data;
            setUserInfo({name, role, username, acaId, userId, roleId, academyName});
        }).catch(() => { // 인증 실패 - 로그인 페이지로..
            navi("/login");
        });
    }, [navi]);

    // 로그아웃 이벤트
    const onLogout = async () => {
      sessionStorage.clear();
      try {
        await axios.post("/public/logout");
        navi("/login");
      } catch(error) {
        alert("로그아웃 오류");
      }
    }

  return (
    <div className='mobile-all'>
      <div className='mobile-header'>
        <div className='mobile-header-title'>
          <img src={whale_L} alt='whale_L' />
          {userInfo !== null && (
            <h6 style={{paddingTop:'15px'}}>{userInfo.name}</h6>
          )}
        </div>
        <i className="bi bi-list mobile-list" onClick={toggleMenu}></i>
      </div>
      {menuOpen && (
        <div className='mobile-menu'>
          <Link to='calendar' className='mobile-menu-item'
           state={{acaId: userInfo.acaId}}>일정확인</Link>
          {/* 권한별 링크 */}
          {userInfo.role === '원장' && (<>
            <div className='mobile-menu-item'>메뉴3</div>
          </>)}
          {userInfo.role === '강사' && (<>
            <div className='mobile-menu-item'>메뉴3</div>
          </>)}
          {userInfo.role === '학부모' && (<>
            <div className='mobile-menu-item'>메뉴3</div>
          </>)}
          {userInfo.role === '학생' && (<>
            <div className='mobile-menu-item'>메뉴3</div>
          </>)}
          <div className='mobile-menu-item'>마이페이지</div>
          <div className='mobile-menu-item' onClick={onLogout}>로그아웃</div>
        </div>
      )}

      <div className='mobile-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default MobileNavi;