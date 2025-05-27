import React from 'react';
import '../attendBook/attend.css';
import './classSetting.css';

const ClassSetting = () => {
    return (
        <div className='attendContainer'>
                {/* 왼쪽 영역 */}
                <div className='leftContainer'>
                <span className='attendTitle'> 클래스 관리 </span>

                <div className='listHeader'>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        클래스 목록
                    </span>

                    <select className='classFilter'>
                        <option> 클래스 필터 </option>
                        <option> 클래스 A </option>
                    </select>
                </div>

                <div className='listBody'>
                    <div className='listContent'>
                        {/* 이하 반복되는 클래스 리스트 ======================================== */}
                        <div className='classPhoto'></div> {/* 여기에 이미지 업로드 */}

                        <div className='classInfo'>
                            <span style={{ fontSize: '22px', color: '#2E5077', fontWeight: '700' }}>
                                클래스 A &nbsp;&nbsp;
                                <span style={{ fontSize: '20px', color: '#2E5077', fontWeight: '500' }}> 
                                    조고래 강사 
                                </span>
                            </span>
                            <span style={{ fontSize: '22px', color: '#2E5077', fontWeight: '700' }}>
                                [현재 인원] &nbsp;&nbsp; 6/30
                            </span>
                        </div>

                        <div className='classDelete'> {/* 삭제 버튼 */}
                            <button> 삭제 </button>
                        </div>
                        {/* ===================================================================== */}
                    </div>
                </div>
            </div>


            {/* 오른쪽 영역 */}
            <div className='rightContainer'>
                <div className='createClassHeader'>
                    <span style={{ fontSize: '25px', color: '#2E5077', fontWeight: '700' }}>
                        클래스 생성
                    </span>
                </div>

                <div className='createClassBody'>
                    <span className='createGrayText'> 이름 </span>
                    <input type='text'></input>
                    <br /><br />

                    <span className='createGrayText'> 정원 </span>
                    <input type='text'></input>
                    <br /><br />

                    <span className='createGrayText'> 담당자 </span>
                    <input type='text'></input>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <select className='classFilter'>
                        <option> 담당자 선택 </option>
                        <option> 클래스 A 담당자 </option>
                    </select>
                    <br /><br />     

                    {/* 생성 버튼 */}
                    <button> 생성 </button>
                </div>
            </div>
        </div>
    );
};

export default ClassSetting;