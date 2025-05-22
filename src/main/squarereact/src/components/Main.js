import React, { useState } from 'react';
import SquareLogo from '../image/SquareLogo.png';
import whale_L from '../image/whale_L.png';
import './main.css'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import BoardMainPage from './BoardMainPage';
// import PostDetail from './PostDetail';
// import PostForm from './PostForm';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Main = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const navi = useNavigate();

    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

//     const username = { name: "user1", role: "parents" };
  
    // 오늘 날짜 구하기
    const today = new Date();
    const formattedDate = `오늘은 ${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일입니다.`;

    // 로그아웃 이벤트
    const onLogout = () => {
        sessionStorage.clear();
        navi("/login");
    }

    return (
        <div>
            <div className='header'>
                {/* Header 좌측 */}
                <img src={SquareLogo} alt="SquareLogo" style={{width:'300px', cursor:'pointer'}}/>
                <h6 style={{marginTop:'30px', marginLeft:'25px', color:'#79D7BE'}}> 
                    <span style={{cursor:'pointer'}} onClick={onLogout}>로그아웃</span>
                    &nbsp;&nbsp;{formattedDate}
                </h6>

                {/* Header 우측 */}
                <img className='headerWhale' src={whale_L} alt='whale_L' />
                <h6 style={{position:'absolute', right:'125px', marginTop:'30px', cursor:'pointerbobㅠ'}}>
                    {
                        sessionStorage.token != null ?
                        <>
                            <b>{sessionStorage.getItem("name")}</b>&nbsp;&nbsp; 
                            {sessionStorage.getItem("role")}
                            <i class="bi bi-person-fill"></i>
                        </>:<></>
                    }
                </h6>
            </div>
            
            
            <div className='bodyContainer'>
                <div className={`navi ${isNavCollapsed ? 'collapsed' : ''}`}>
                    {/* Navi 접고 펴기 버튼 - 오른쪽 상단 고정 */}
                    <div className='toggleButton' onClick={toggleNav}>
                        <i className={`bi ${isNavCollapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"}`}></i>
                    </div>

                    {/* Navi1 - 수강생 =============================================================== */}
                    <div className='students naviForm'>
                        <span className='naviTitle'> 수강생 </span> <br />
                        <span className='naviContent'> <i class="bi bi-people"></i>&nbsp;&nbsp; 
                            수강생 관리 
                        </span> <br />

                        <span className='naviContent'>
                            <i className="bi bi-clipboard-check"></i>&nbsp;&nbsp;
                            <Link to="/attend" style={{ textDecoration: 'none', color: 'inherit' }}>
                                출석 관리
                            </Link>
                        </span> <br />

                        <span className='naviContent'> 
                            <i class="bi bi-pencil"></i>&nbsp;&nbsp;
                            <Link to="/evaluationStudent" style={{ textDecoration: 'none', color: 'inherit' }}>
                                종합 평가 
                            </Link>
                        </span>
                    </div>

                    {/* Navi2 - 소통 ================================================================ */}
                    <div className='communication naviForm'>
                        <span className='naviTitle'> 소통 </span> <br />
                        <span className='naviContent'> <i class="bi bi-megaphone"></i>&nbsp;&nbsp; 
                            학원 게시판
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-question-circle"></i>&nbsp;&nbsp;
                            상담 신청 및 Q&A
                        </span> <br />
                    </div>

                    {/* Navi3 - 수강료 =================================================================== */}
                    <div className='payment naviForm'>
                        <span className='naviTitle'> 수강료 </span> <br />
                        <span className='naviContent'>
                            <i class="bi bi-credit-card"></i>&nbsp;&nbsp; 
                            <Link to="/paymentManagement" style={{ textDecoration: 'none', color: 'inherit' }}>
                                수강료 관리
                            </Link>
                        </span> <br />
                        <span className='naviContent'>
                            <i class="bi bi-exclamation-triangle"></i>&nbsp;&nbsp;
                            <Link to="/nonPayCheck" style={{ textDecoration: 'none', color: 'inherit' }}>
                                미납 관리
                            </Link>
                        </span> <br />
                    </div>

                    {/*  Navi4 - 학습 관리 =========================================================== */}
                    <div className='study naviForm'>
                        <span className='naviTitle'> 학습 관리 </span> <br />
                        <span className='naviContent'> <i class="bi bi-clock-history"></i>&nbsp;&nbsp; 
                            시간표 설정
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-calendar-event"></i>&nbsp;&nbsp;
                            학원 캘린더
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-collection"></i>&nbsp;&nbsp;
                            자료실
                        </span> <br />
                    </div>

                    {/* Navi5 - 학원 정보 ================================================================ */}
                    <div className='info naviForm'>
                        <span className='naviTitle'> 학원 정보 </span> <br />
                        <span className='naviContent'> <i class="bi bi-gear"></i>&nbsp;&nbsp; 
                            학원 설정
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-bounding-box-circles"></i>&nbsp;&nbsp;
                            클래스 관리
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-person-check"></i>&nbsp;&nbsp;
                            멤버 관리
                        </span> <br />
                    </div>
                </div>

                {/* 본문 컨텐츠 영역 */}
                <div className='contents'>
                       {/* <Router>
                           <Routes>
                               <Route path="/" element={<BoardMainPage username={username} />} />
                               <Route path="/post/:postId" element={<PostDetail username={username} />} />
                               <Route path="/post/create" element={<PostForm username={username} />} />
                           </Routes>
                       </Router> */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Main;