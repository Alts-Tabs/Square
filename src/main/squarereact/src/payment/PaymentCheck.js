import React, { useEffect, useState } from 'react';
import './PaymentPayCheck.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPayCheck = () => {
    //라우팅 경로 상에서 받아 낼 파라미터
    const { roleId } = useParams();

    //결제 직전 학부모가 결제할 장바구니 내역 데이터 - 배열로 받아와야 함
    const [enrollList, setEnrollList] = useState([]);
    //결제 이후 학부모가 이전에 결제한 내역을 확인할 수 있는 데이터
    const [prevPay, setPrevPay] = useState([]);

    // 장바구니 목록 불러오기
    const fetchEnrollList = () => {
        if(!roleId) return;

        axios.get(`/student/${roleId}/enrollList`, {withCredentials: true})
        .then(res => {setEnrollList(res.data)})
        .catch(err => {alert('장바구니 호출 실패')})
    }

    //학생 입장에서 본인 부모의 기존 결제 내역 불러오기
    const fetchPrevList = () => {
        if(!roleId) return;

        axios.get(`/student/${roleId}/PrevPay`, {withCredentials: true})
        .then(res => {setPrevPay(res.data)})
        .catch(err => {alert('기존 결제 내역 호출 실패')})
    }

    // 장바구니 한번만 부르기
    useEffect(() => {
        fetchEnrollList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleId]);
    // 장바구니 한번만 부르기
    useEffect(() => {
        fetchPrevList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleId]);

    return (
        <div>
           <div className='paymentManagementContainer'>    
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 본인 학원비 결제 </span>
                    <div className='PrevPayclassRead'>
                        {prevPay.length === 0 ? (
                                <div>결제한 클래스가 없습니다.</div>
                            ):(
                                <table border={0} className='enrollWaitTable'>
                                    <tbody>
                                    {prevPay.map(pp=>(
                                        <React.Fragment key={pp.id}>
                                            <tr>        
                                                <td rowSpan={2}>
                                                    <div className='ellipse'/>
                                                </td>
                                                <td>학생명 {pp.studentName}</td>
                                                <td>{pp.duration}</td>
                                                <td>{pp.tuition}원</td>
                                            </tr>
                                            <tr>
                                                <td>{pp.className}</td>
                                                <td>
                                                
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>


                <div className='rightPCContainer'>
                    {/* 수업 신규 등록 */}
                    
                    <div className='insertClass'>
                        <span className='title'> 부모님이 결제할 내역 </span>
                        <hr />
                        {/* 이런 식으로 신청하기 버튼을 누르면 뜨게 하기 */}
                        {enrollList.length === 0 ? (
                                <div>결제해야 할 클래스가 없습니다.</div>
                            ):(
                                <table border={0} className='enrollWaitTable'>
                                    <tbody>
                                    {enrollList.map(el=>(
                                        <React.Fragment key={el.id}>
                                            <tr>
                                                <td rowSpan={3}>
                                                    <div className='ellipse'/>
                                                </td>
                                                <td>학생명 {el.studentName}</td>
                                                <td>{el.duration}</td>
                                            </tr>
                                            <tr>
                                                <td>{el.className}</td>
                                                <td>
                                                    
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>
                                                        {el.tuition}원
                                                    </b>
                                                </td>
                                                <td>
                                                    
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>    
            </div>  
        </div>
    );
};

export default PaymentPayCheck;