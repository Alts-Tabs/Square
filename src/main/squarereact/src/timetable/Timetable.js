import React, { useEffect, useState } from 'react';
import '../attendBook/attend.css';
import './timetable.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Timetable = () => {

    // 로그인 시 받은 사용자 정보 상태
    const [userInfo, setUserInfo] = useState({name: '', role: '', username: '', acaId: '', userId: ''});
        const navi = useNavigate();

        useEffect(() => {
            axios.get("/public/user", {withCredentials: true})
                .then(res => {
                    const {name, role, username, acaId, userId} = res.data;
                    setUserInfo({name, role, username, acaId, userId});
                }).catch(() => {
                    navi("/login");
                });
        }, [navi]);

    // 권한에 따른 전용 기능 구현
    const role = userInfo.role;

    // '일', '주', '월' 중 하나만 선택
    const [selectedPeriod, setSelectedPeriod] = useState(''); 
    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);
    };


    return (
        <div className='attendContainer'>
            <div className='leftContainer' style={{width:'17%'}}>
                <span className='attendTitle'> 시간표 </span>
                    
                {/* leftContainer */}
                <div className='radioContainer'>
                    {/* 클래스 목록 반복 리스트 ========================= */}
                    <label className="radioItem">
                        <input type="radio" name="class" value="option1" />
                        <span className="radioMark"></span>
                        <span className="radioText">(클래스 A)</span>
                    </label>
                    {/* ================================================= */}
                    <label className="radioItem">
                        <input type="radio" name="class" value="option2" />
                        <span className="radioMark"></span>
                        <span className="radioText">(클래스 B)</span>
                    </label>
                    <label className="radioItem">
                        <input type="radio" name="class" value="option3" />
                        <span className="radioMark"></span>
                        <span className="radioText">(클래스 C)</span>
                    </label>
                </div>'
                
                <div className='buttonsWrapper2'>
                    {['일', '주', '월'].map((label) => (
                        <button
                            key={label}
                            onClick={() => handlePeriodClick(label)}
                            className={selectedPeriod === label ? 'selectedButton' : ''}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>


            {/* rightContainer - 우측 시간표 영역 */}
            <div className='timetableContainer'>
                {/* 학생 & 학부모는 아래 버튼 렌더링 X */}
                {(userInfo.role !== '학생' && userInfo.role !== '학부모') && (
                    <div className='buttonsWrapper'>
                        <button> 편집 </button>
                        <button> 시간표 생성 </button>
                    </div>
                )}

                <div className='timetable'>
                    시간표 자리 ㅎㅅㅎ 배경색은 영역 파악용~
                </div>
            </div>

        </div>
    );
};

export default Timetable;