import React from 'react';
import './attend.css';
import './attendHistory.css';
import { Link } from 'react-router-dom';

const AttendHistory = () => {
    return (
        <div className='attendContainer'>

            <div className='leftContainer2'>
                {/* 출석부 편집 ================================================================== */}
                <span className='title'> (25.05.09 금요일) 출석부 </span>
                {/* < 이전 */}
                <div className='attendbookHeader'>
                    <Link to="/attend">
                        <i className="bi bi-chevron-left"></i>
                        <span>이전</span>
                    </Link>
                </div>

                {/* 출석부 표 */}
                <div className='attendbookBody'>
                    <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}> 
                        (수업명) 총 인원 (수)명 
                    </span>
                    <br />
                    
                    {/* 출석&지각&결석 아이콘 */}
                    <span className='attendIcons'>
                        <i class="bi bi-circle-fill" style={{color:'#79D7BE'}}></i> {/* ● 출석 */} 
                        <span className='historyCount2'> 출석 (수)명 </span>
                    </span>
                    <span className='attendIcons'>
                        <i class="bi bi-triangle-fill" style={{color:'#FFB83C'}}></i> {/* ▲ 지각 */}
                        <span className='historyCount2'> 지각 (수)명 </span>
                    </span>
                    <span className='attendIcons'>
                        <i class="bi bi-x-lg" style={{color:'#D85858'}}></i> {/* X 결석 */}
                        <span className='historyCount2'> 결석 (수)명 </span>
                    </span>
                    <br />
                    
                    <span style={{fontSize:'19px', opacity:'0.7'}}>
                        출석/지각/결석 아이콘을 누르고 저장하면 출결을 변경하실 수 있습니다.
                    </span>

                    {/* 출석부 표 */}
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>출석</th>
                                <th>지각</th>
                                <th>결석</th>
                                <th>수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>학생명</td>
                                <td>
                                    <i className="bi bi-circle-fill" style={{ color: '#79D7BE', fontSize: '35px' }}></i>
                                </td>
                                <td>
                                    <i className="bi bi-triangle-fill" style={{ color: '#FFB83C', fontSize: '35px' }}></i>
                                </td>
                                <td>
                                    <i className="bi bi-x-lg" style={{ color: '#D85858', fontSize: '35px' }}></i>
                                </td>
                                <td>
                                    <button> 수정 </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>



            <div className='rightContainer2'>
                {/* 메모 작성 ================================================================== */}
                <div className='memoHeader'>
                    <span style={{fontSize:'25px', color:'#2E5077', fontWeight:'700'}}>
                        메모 작성
                    </span>
                    <span> 
                        저장 
                    </span>
                </div>

                <div className='memoBody'>
                    <textarea placeholder="메모 작성 후 저장 버튼을 눌러주세요."></textarea>
                </div>
            </div>
        </div>
    );
};

export default AttendHistory;