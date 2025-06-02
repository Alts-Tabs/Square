import React, { useCallback, useEffect, useState } from 'react';
import './PaymentPayCheck.css';
import { useParams } from 'react-router-dom';



const PaymentPayCheck = () => {
    const [classes, setClasses] = useState([]);
    const [selClasses, setSelClasses] = useState([]);

    return (
        <div>
           <div className='paymentManagementContainer'>    
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 자녀 학원비 결제 </span>
                    <div className='classRead'>
                        <table>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;학생명 전상훈&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>2025년 4월</td>
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[국어]</td>
                                <td></td>   
                            </tr>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>2025년 3월</td>
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[수학]</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>2025년 2월</td>
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[사회]</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>2025년 1월</td>
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[과학]</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 수업료 변경 */}
                    <div className='selectParentClass'>
                        <div className='insertClass'>
                            <select className='classFilter' style={{ width: '70%' }}
                            value={selClasses} onChange={(e) => setSelClasses(e.target.value)}>
                                <option value=''> 수업 선택 </option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                            <table>
                                <tr>
                                    <td rowspan="3">
                                        <div className='ellipse'/>
                                    </td>
                                    <td>강사명 고영희</td>
                                </tr>
                                <tr>
                                    <td>[사회]</td>
                                </tr>
                                <tr>
                                    <td>400,000원</td>
                                </tr>
                            </table>
                            <button className='btn insertButton btn-outline-success'>신청하기</button>
                        </div>
                    </div>

                    {/* 수업 신규 등록 */}
                    <span className='title'> 수업 등록  </span>
                    <div className='insertClass'>
                        <button className='btn insertButton btn-outline-success'>결제하기</button>
                    </div>
                </div>    
            </div>  
        </div>
    );
};

export default PaymentPayCheck;