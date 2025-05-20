import React from 'react';
import './paymentManagement.css';

const PaymentManagement = () => {
    return (
        <div>
           <div className='paymentManagementContainer'>    
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 결제 관리 </span>
                    <div className='classRead'>
                        <span> 전체 반 </span>
                        <hr></hr>
                        <table className='classMenu'>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
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
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[과학]</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>수업료 400,000원</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[영어]</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>


                <div className='rightContainer'>
                    {/* 수업료 변경 */}
                    <span className='title'> 수업료 변경 </span>
                    <div className='tuitionUpdate'>
                        <div className='insertClass'>
                            <p className='insert-label'>
                                수업명&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <p className='insert-label'>
                                수업료&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <p className='insert-label'>
                                강사명&nbsp;&nbsp;&nbsp;
                                <input className='insert-input'/>
                            </p>
                            <button className='btn insertButton btn-outline-success'>수정</button>
                        </div>
                    </div>

                    {/* 수업 신규 등록 */}
                    <span className='title'> 수업 등록 </span>
                    <div className='insertClass'>
                        <p className='insert-label'>
                            수업명&nbsp;&nbsp;&nbsp;
                            <input className='insert-input'/>
                        </p>
                        <p className='insert-label'>
                            수업료&nbsp;&nbsp;&nbsp;
                            <input className='insert-input'/>
                        </p>
                        <p className='insert-label'>
                            강사명&nbsp;&nbsp;&nbsp;
                            <input className='insert-input'/>
                        </p>
                        <button className='btn insertButton btn-outline-success'>추가</button>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default PaymentManagement;