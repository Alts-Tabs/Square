import React from 'react';
import './NonPayCheck.css';

const NonPayCheck = () => {
    return (
        <div>
            <div className='nonPayCheckContainer'>
                <div className='nonPay-topContainer'>
                    <h2 className='nonPayTitle'>미납 관리</h2>
                    <div className='nonPay-selectInfo'>
                        <table>
                        <tr>
                            <td>
                                <select>
                                    <option>
                                        반을 선택하세요.
                                    </option>
                                </select>
                            </td>
                            <td>
                                <b>반을 선택하세요.</b>
                            </td>
                        </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div className='nonPay-listContainer'>
                <table className='classMenu'>
                            <tr>
                                <td rowspan="2">
                                    <div className='ellipse'/>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;강사명 고영희&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>수업료 400,000원</td>
                                <td>납부</td>
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
                                <td>납부</td>
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
                                <td>미납</td>
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
                                <td>미납</td>
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
                                <td>납부</td>
                            </tr>
                            <tr>
                                <td>&nbsp;&nbsp;&nbsp;[영어]</td>
                                <td></td>
                            </tr>
                        </table>
            </div>
        </div>
    );
};

export default NonPayCheck;