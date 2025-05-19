import React, { useState } from 'react';
import './attend.css'
import { Link } from 'react-router-dom';

const Attend = () => {

    const [attending, setAttending] = useState(false);
    const [randomNumber, setRandomNumber] = useState(null);    

    const handleAttendanceClick = () => {
        if (!attending) {
        const random = Math.floor(100 + Math.random() * 900);
        setRandomNumber(random);
        setAttending(true);
        } else {
        setAttending(false);
        setRandomNumber(null);
        }
    };

    return (
            <div className='attendContainer'>
                
                <div className='leftContainer'>
                    {/* 오늘의 출석 ==================================================== */}
                    <span className='title'> 오늘의 출석 </span>
                    {/* 지금 수업은 ~입니다. */}
                    <div className='todayAttendTitle'>
                        <span> 지금 수업은 </span>
                        <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'800'}}> 
                            (수업 시간표) 
                        </span>
                        <span> 입니다. </span> <br/>
                    </div>

                    {/* 출석 버튼 이벤트 */}
                    <div className='todayAttendContent'>
                        <span style={{fontSize:'23px', color:'#2E5077', fontWeight:'700'}}>
                            (날짜 출력 - 25.05.19 출석)
                        </span>
                        <br />

                        {/* 3자리 랜덤 숫자 출력 */}
                        {randomNumber && (
                            <div style={{
                            fontSize: '60px',
                            fontWeight: 'bold',
                            color: '#2E5077',
                            }}>
                            {randomNumber}
                            </div>
                        )}

                        <button
                        onClick={handleAttendanceClick}
                        className={`attendButton ${attending ? 'end' : ''}`}
                        >
                        {attending ? '출석 종료' : '출석 시작'}
                        </button>

                        <hr />
                        
                        {/* 반복 처리 리스트 */}
                        <div className='studentList'>
                            (프로필 이미지)
                            <hr style={{border:'1px solid #7D8A8A'}}/>
                            <span className='attenderTitle'> (학생명) </span>
                        </div>
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 우리 반 누적 출석률 =========================================== */}
                    <span className='title'> 우리 반 누적 출석률 </span>
                    <div className='stackAttend'>
                        {/* 원형 그래프 */}
                        <div className='attendGraph'>
                            그래프 자리
                        </div>

                        {/* 반 누적 % */}
                        <div className='attendClass'>
                            <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}> 우리 반 누적 출석률은 </span> &nbsp;        
                            <span style={{fontSize:'25px', color:'#79D7BE', fontWeight:'800'}}> (수치)% </span> &nbsp;                               
                            <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}> ! </span>
                            
                            <div className="attenderWrapper">
                                <div className='attender'>
                                    <span className='attenderTitle'> 이번 달 출석왕 </span> <br />
                                    <span className='attenderName'> (학생명) </span>
                                </div>

                                <div className='attender'>
                                    <span className='attenderTitle'> 이번 달 분발왕 </span> <br />
                                    <span className='attenderName'> (학생명) </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 지난 출석 ==================================================== */}
                    <span className='title'> 지난 출석 </span>
                    <div className='historyAttend'>
                        {/* 반복 처리 리스트 */}
                        <div className='historyList'>
                            <span style={{fontSize:'23px', color:'#2E5077', fontWeight:'700', display:'inline-block', marginRight:'20px'}}>
                                (지난 날짜 25.05.09 금요일 출석)
                            </span>

                            <span style={{display:'inline-block', marginRight:'10px'}}>
                                <i class="bi bi-circle-fill" style={{color:'#79D7BE'}}></i> {/* ● 출석 */} 
                                <span className='historyCount'> (수) </span>
                            </span>
                            <span style={{display:'inline-block', marginRight:'10px'}}>
                                <i class="bi bi-triangle-fill" style={{color:'#FFB83C'}}></i> {/* ▲ 지각 */}
                                <span className='historyCount'> (수) </span>
                            </span>
                            <span style={{display:'inline-block', marginRight:'500px'}}>
                                <i class="bi bi-x-lg" style={{color:'#D85858'}}></i> {/* X 결석 */}
                                <span className='historyCount'> (수) </span>
                            </span>

                            {/* > 상세보기 이동 아이콘 (학생&학부모 계정에선 보이지 않는 버튼) */}
                            <Link to="/attend-history">
                                <i className="bi bi-chevron-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>


                
            </div>
    );
};

export default Attend;