import React from 'react';
import SquareLogo from '../image/SquareLogo.png';
import whale_L from '../image/whale_L.png';
import './mainstyle.css'

const Main = () => {




    return (
        <div>
            <div className='header'>
                {/* Header 좌측 */}
                <img src={SquareLogo} alt="SquareLogo" style={{width:'300px'}}/>
                <h6 style={{marginTop:'30px', marginLeft:'25px', color:'#79D7BE'}}> 
                    로그아웃 토글 및 날짜 위치
                </h6>
                
                {/* Header 우측 */}
                <img className='headerWhale' src={whale_L} />
                <h6 style={{position:'absolute', right:'125px', marginTop:'30px'}}>
                    <b>용가뤼</b>&nbsp;&nbsp; 원장<i class="bi bi-person-fill"></i>
                </h6>
            </div>
            
            
            <div className='bodyContainer'>
                <div className='navi'>
                    {/* Navi1 - 수강생 =============================================================== */}
                    <div className='students naviForm'>
                        <span className='naviTitle'> 수강생 </span> <br />
                        <span className='naviContent'> <i class="bi bi-people"></i>&nbsp;&nbsp; 
                            수강생 관리 
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-clipboard-check"></i>&nbsp;&nbsp;
                            출석 관리 
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-pencil"></i>&nbsp;&nbsp;
                            종합 평가 
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
                        <span className='naviContent'> <i class="bi bi-credit-card"></i>&nbsp;&nbsp; 
                            수강료 관리
                        </span> <br />
                        <span className='naviContent'> <i class="bi bi-exclamation-triangle"></i>&nbsp;&nbsp;
                            미납 관리
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


                <div className='contents'>
                    여기가 컨텐츠
                </div>
            </div>
        </div>
    );
};

export default Main;