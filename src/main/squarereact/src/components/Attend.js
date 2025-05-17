import React from 'react';
import './attend.css'

const Attend = () => {
    return (
            <div className='attendContainer'>
                
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 오늘의 출석 </span>
                    <div className='todayAttendTitle'>
                        <span> 지금 수업은 </span>
                        <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'800'}}> 
                            (수업 시간표) 
                        </span>
                        <span> 입니다. </span> <br/>
                    </div>

                    <div className='todayAttendContent'>
                        출석 내용
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 우리 반 누적 출석률 */}
                    <span className='title'> 우리 반 누적 출석률 </span>
                    <div className='stackAttend'>
                        내용
                    </div>

                    {/* 지난 출석 */}
                    <span className='title'> 지난 출석 </span>
                    <div className='historyAttend'>
                        지난 출석 내용
                    </div>
                </div>


                
            </div>
    );
};

export default Attend;