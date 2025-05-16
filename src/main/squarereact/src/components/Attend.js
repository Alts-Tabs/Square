import React from 'react';
import './attend.css'

const Attend = () => {
    return (
        <div>
            <div className='attendContainer'>
                
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 오늘의 출석 </span>
                    <div className='todayAttend'>
                        <span> 지금 수업은 </span>
                        <span> (수업 시간표) </span>
                        <span> 입니다. </span>
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 우리 반 누적 출석률 */}
                    <div className='stackAttend'>
                        <span className='title'> 우리 반 누적 출석률 </span>
                    </div>

                    {/* 지난 출석 */}
                    <div className='historyAttend'>
                        <span className='title'> 지난 출석 </span>
                    </div>
                </div>


                
            </div>
        </div>
    );
};

export default Attend;