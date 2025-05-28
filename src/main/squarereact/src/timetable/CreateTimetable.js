import React from 'react';
import '../attendBook/attend.css';
import './timetable.css';
import './createTimetable.css'; 

const CreateTimetable = () => {
    return (
        <div className='attendContainer'>
            {/* 시간표 생성 영역 =========================================== */}
            <div className='leftContainer'>
                <span className='attendTitle'> 시간표 생성 </span>
                
                <div className='createWrapper'>
                    {/* 구성요소 제목 영역 */}
                    <div className='createTitle'>
                        <span> 제목 </span>
                        <span> 수업 </span>
                        <span> 반 </span>
                        <span> 조건 </span>
                    </div>

                    {/* 내용 설정 영역 */}
                    <div className='createContent'>
                        <input type='text'></input> 
                    </div>
                </div>
            </div>

            {/* 시간표 미리보기 ============================================ */}
            <div className='rightContainer'>

            </div>
        </div>
    );
};

export default CreateTimetable;