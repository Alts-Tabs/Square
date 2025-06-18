import React, { useEffect, useRef, useState } from 'react';
import SquareLogo from '../image/SquareLogo.png';
import whale_L from '../image/whale_L.png';
import './main.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import axios from 'axios';

const Main = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const navi = useNavigate();

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  // 오늘 날짜 구하기
  const today = new Date();
  const formattedDate = `오늘은 ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일입니다.`;

  // 로그인 시 받은 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: '',
    username: '',
    acaId: '',
    userId: '',
    roleId: '',
    academyName: '',
  });

  useEffect(() => {
    // 페이지 로드 시 사용자 정보 요청
    axios
      .get('/public/user', { withCredentials: true })
      .then((res) => {
        const { name, role, username, acaId, userId, roleId, academyName } = res.data;
        setUserInfo({ name, role, username, acaId, userId, roleId, academyName });
      })
      .catch(() => {
        // 인증 실패 - 로그인 페이지로 이동
        navi('/login');
      });
  }, [navi]);

  // 로그아웃 이벤트
  const onLogout = async () => {
    sessionStorage.clear();
    try {
      await axios.post('/public/logout');
      navi('/login');
    } catch (error) {
      alert('로그아웃 오류');
    }
  };

  /* 계정 아이콘 dropdown 이벤트 - 외부 클릭 시 닫기 */
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // 권한에 따른 전용 기능 구현
  const role = userInfo.role;
  const [openModal, setOpenModal] = useState(false);
  const roleItems = {
    학부모: [{ label: '자녀 등록', onClick: () => setOpenModal(true) }],
    원장: [{ label: '가입코드 생성', onClick: () => navi('subuserregistry') }],
  };
  const itemToRender = roleItems[role] || [];

  // 학생 코드 이벤트
  const [people, setPeople] = useState(1);
  const [code, setCode] = useState('');
  const stuCodeEvent = async () => {
    if (!userInfo.username) {
      navi('/login');
      return;
    }

    const url = `/parent/code?username=${userInfo.username}&people=${people}`;

    try {
      const res = await axios.post(url, {}, { headers: { withCredentials: true } });
      const resultCode = res.data.code;
      setCode(resultCode);
    } catch (err) {
      alert('코드 생성 실패');
    }
  };

  // 코드 복사 이벤트
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); // 아이콘 변경
      setTimeout(() => setCopied(false), 1000); // 1초 후 아이콘 원상복구
    } catch (err) {
      alert('복사 실패: ' + err.message);
    }
  };

  return (
    <div>
      <div className="header">
        {/* Header 좌측 */}
        <img
          src={SquareLogo}
          alt="SquareLogo"
          style={{ width: '300px', cursor: 'pointer' }}
          onClick={() => navi('/main')}
        />
        <h6 style={{ marginTop: '30px', marginLeft: '25px', color: '#79D7BE' }}>{formattedDate}</h6>

        {/* Header 우측 */}
        <img className="headerWhale" src={whale_L} alt="whale_L" />
        <h6 style={{ position: 'absolute', right: '125px', marginTop: '30px' }}>
          {userInfo.name ? (
            <>
              <b>{userInfo.name}</b> 
              {userInfo.role}
              <i
                className="bi bi-person-fill"
                onClick={toggleDropdown}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
              ></i>
            </>
          ) : (
            <></>
          )}
        </h6>
        {/* dropdown 내용 */}
        {open && (
          <div className="headerList" ref={dropdownRef}>
            <Link to="mypage" className="headerLink">
              내 정보
            </Link>
            <hr />
            {itemToRender.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="headerSpan" onClick={item.onClick}>
                  {item.label}
                </span>
                <hr />
              </React.Fragment>
            ))}
            <span className="headerSpan" onClick={onLogout}>
              로그아웃
            </span>
          </div>
        )}
      </div>

      {/* 학생 등록 모달 */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <div style={{ width: '50%' }}>
            {code === '' ? (
              <>
                <label>등록할 학생의 수는 몇 명인가요?</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  placeholder="1~10명"
                  value={people}
                  className="form-control"
                  onChange={(e) => setPeople(e.target.value)}
                />
                <button type="button" className="loginbtn" onClick={stuCodeEvent}>
                  학생 등록
                </button>
              </>
            ) : (
              <>
                <label>계정 가입 코드</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="text" value={code} className="form-control" readOnly />
                  <i
                    className={`bi ${copied ? 'bi-text-paragraph' : 'bi-front'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={handleCopy}
                  ></i>
                </div>
                <br />
                <b>
                  복사하여 코드를 기입해
                  <br /> 계정을 생성하세요!
                </b>
              </>
            )}
          </div>
        </Modal>
      )}

      <div className="bodyContainer">
        <div className={`navi ${isNavCollapsed ? 'collapsed' : ''}`}>
          {/* Navi 접고 펴기 버튼 - 오른쪽 상단 고정 */}
          <div className="toggleButton" onClick={toggleNav}>
            <i className={`bi ${isNavCollapsed ? 'bi-arrow-bar-right' : 'bi-arrow-bar-left'}`}></i>
          </div>

          {/* Navi1 - 수강생 */}
          <div className="students naviForm">
            <span className="naviTitle">수강생</span> <br />
            {userInfo.role !== '학생' && userInfo.role !== '학부모' && (
              <>
                <span className="naviContent">
                  <i className="bi bi-people"></i> 
                  <Link
                    to="studentsManage"
                    state={{ acaId: userInfo.acaId }}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    수강생 관리
                  </Link>
                </span>
                <br />
              </>
            )}

            <span className="naviContent">
              <i className="bi bi-clipboard-check"></i> 
              {userInfo.role === '학생' ? (
                <Link to={`attend-stu/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  출석 관리
                </Link>
              ) : userInfo.role === '학부모' ? (
                <Link to="attend-parent" style={{ textDecoration: 'none', color: 'inherit' }}>
                  출석 관리
                </Link>
              ) : userInfo.role ? (
                <Link to={`attend/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  출석 관리
                </Link>
              ) : (
                <span style={{ textDecoration: 'none', color: 'inherit' }}>출석 관리</span>
              )}
            </span> <br />

            <span className="naviContent">
              <i className="bi bi-pencil"></i> 
              {userInfo.role === '학생' ? (
                <Link to="evaluationStudent" style={{ textDecoration: 'none', color: 'inherit' }}>
                  종합 평가
                </Link>
              ) : userInfo.role === '학부모' ? (
                <Link to="evaluationParents" style={{ textDecoration: 'none', color: 'inherit' }}>
                  종합 평가
                </Link>
              ) : userInfo.role ? (
                <Link to="evaluationAdmin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  종합 평가
                </Link>
              ) : (
                <span style={{ textDecoration: 'none', color: 'inherit' }}>종합 평가</span>
              )}
            </span>
          </div>

          {/* Navi2 - 소통 */}
          <div className="communication naviForm">
            <span className="naviTitle">소통</span> <br />
            <span className="naviContent">
              <i className="bi bi-megaphone"></i> 
              <Link to="board" style={{ textDecoration: 'none', color: 'inherit' }}>
                학원 게시판
              </Link>
            </span> <br />           
          </div>

          {/* Navi3 - 수강료 */}
          <div className="payment naviForm">
            <span className="naviTitle">수강료</span> <br />
            {userInfo.role === '원장' ? (
              <>
                <span className="naviContent">
                  <i className="bi bi-credit-card"></i> 
                  <Link to={`paymentManagement/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    수강료 관리
                  </Link>
                </span>
                <br />
              </>
            ) : userInfo.role === '학부모' ? (
              <>
                <span className="naviContent">
                  <i className="bi bi-credit-card"></i> 
                  <Link
                    to={`paymentPayCheck/${userInfo.acaId}/${userInfo.roleId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    수강료 결제 및 확인
                  </Link>
                </span>
                <br />
              </>
            ) : userInfo.role === '학생' ? (
              <>
                <span className="naviContent">
                  <i className="bi bi-credit-card"></i> 
                  <Link to={`paymentCheck/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    수강료 확인
                  </Link>
                </span>
                <br />
              </>
            ) : null}

            {userInfo.role !== '학생' && userInfo.role !== '학부모' ? (
              <>
                <span className="naviContent">
                  <i className="bi bi-exclamation-triangle"></i> 
                  <Link to={`nonPayCheck/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    미납 관리
                  </Link>
                </span>
                <br />
              </>
            ) : null}
          </div>

          {/* Navi4 - 학습 관리 */}
          <div className="study naviForm">
            <span className="naviTitle">학습 관리</span> <br />
            <span className="naviContent">
              <i className="bi bi-clock-history"></i> 
              <Link to="timetable" style={{ textDecoration: 'none', color: 'inherit' }}>
                시간표
              </Link>
            </span> <br />

            <span className="naviContent">
              <i className="bi bi-calendar-event"></i> 
              <Link
                to="academycaller"
                state={{ acaId: userInfo.acaId, role: userInfo.role }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                학원 캘린더
              </Link>
            </span> <br />

            {userInfo.role && userInfo.role !== '학부모' ? (
              <>
                <span className="naviContent">
                  <i className="bi bi-collection"></i> 
                  <Link to="reference" style={{ textDecoration: 'none', color: 'inherit' }}>
                    자료실
                  </Link>
                </span>
                <br />
              </>
            ) : null}
          </div>

          {/* Navi5 - 학원 정보 (관리자 & 원장만 접근 가능) */}
          {(userInfo.role === '관리자' || userInfo.role === '원장') && (
            <div className="info naviForm">
              <span className="naviTitle">학원 정보</span> <br />
              <span className="naviContent">
                <i className="bi bi-bounding-box-circles"></i> 
                <Link to={`students-manage/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  클래스 관리
                </Link>
              </span> <br />
              <span className="naviContent">
                <i className="bi bi-gear"></i> 
                <Link to={`class-setting/${userInfo.acaId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  클래스 설정
                </Link>
              </span> <br />
              <span className="naviContent">
                <i className="bi bi-person-check"></i> 
                멤버 관리
              </span> <br />
            </div>
          )}

          {/* Navi6 - 챗봇 */}
          <div className="chatbot naviForm">
            <span className="naviTitle">챗봇</span> <br />
            <span className="naviContent">
              <i className="bi bi-chat"></i> 
              <Link to="chat" style={{ textDecoration: 'none', color: 'inherit' }}>
                챗봇
              </Link>
            </span>
          </div>
        </div>

        {/* 본문 컨텐츠 영역 */}
        <div className="contents">
          <Outlet context={userInfo} /> {/* userInfo를 context로 전달 */}
        </div>
      </div>
    </div>
  );
};

export default Main;