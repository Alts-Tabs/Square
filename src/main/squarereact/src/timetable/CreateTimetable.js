import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../attendBook/attend.css';
import '../settings/classSetting.css';
import './timetable.css';
import './createTimetable.css'; 
import { useParams } from 'react-router-dom';

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

                    <div className='createContent'>
                        {/* 내용 설정 영역 (왼) */}
                        <div className='contentRow'>
                            <input type='text'></input> 
                            
                            {/* 내용 설정 영역 (오) */}
                            <span className='toggleContainer'>
                                수업/반 추가 토글
                            </span>
                        </div>
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