import React, { useEffect, useState } from 'react';
import './PaymentPayCheck.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { loadTossPayments } from "@tosspayments/payment-sdk";

const PaymentPayCheck = () => {
    //라우팅 경로 상에서 받아 낼 파라미터
    const { acaId, roleId } = useParams();

    //수강신청 하기 전 학부모가 신청할 수 있는 수업 전체와 선택될 수업
    const [classes, setClasses] = useState([]);
    const [selClass, setSelClass] = useState([]);
    //select 상에서 수강신청할 수업과 수업의 기간
    const selectedClass = classes.find(cls => String(cls.id) === String(selClass));
    //([])로 넣으면 수업 기간이 배열로 들어가서 json 에러 발생
    //()로 넣어도 JSON 직렬화 문제를 발생시켜서 403 error 나오게 함!
    const [duration, setDuration] = useState(''); 
    //학부모의 전체 자녀와 그 중에서 셀렉트로 선택할 수업을 들을 자녀를 선택
    const [students, setStudents] = useState([]);
    const [selStudent, setSelStudent] = useState('');

    //결제 직전 학부모가 결제할 장바구니 내역 데이터 - 배열로 받아와야 함
    const [enrollList, setEnrollList] = useState([]);
    //결제 이후 학부모가 이전에 결제한 내역을 확인할 수 있는 데이터
    const [prevPay, setPrevPay] = useState([]);

    //toss payment 에 필요한 결제정보
    const clientKey= "test_ck_24xLea5zVAaJyNK2GBd0VQAMYNwW";

    useEffect(() => {
        if (!roleId) {
            alert('학부모 정보가 없습니다!');    
            return;
        }
        axios.get(`/parent/${roleId}/students`, { withCredentials: true })
            .then(res => setStudents(res.data))
            .catch(err => alert('자녀 목록 호출 실패'));
    }, [roleId]);

    //장바구니에 넣을 이벤트 데이터 설정
    const handleEnrollDuration = (e) => {
        setDuration(e.target.value);
    }

    //장바구니 신청 이벤트
    const handleEnroll = () => {
        if (!selClass || !selStudent) 
            return alert('수업/자녀를 선택하세요');
        axios.post(
            `/parent/paymentEnroll/${acaId}/${roleId}/${selStudent}`,
            {
                classId: selClass,
                parentId: roleId,
                studentId: selStudent,
                duration: duration
            },
            { withCredentials: true }
        )
        .then(res => {
            alert("신청이 완료되었습니다!");
            /* enroll 리스트 추가 등 */
            fetchEnrollList();
            fetchPrevList();
        })
        .catch(err => alert('신청 실패'));
    };

    // 장바구니 목록 불러오기
    const fetchEnrollList = () => {
        if(!roleId) return;

        axios.get(`/parent/${roleId}/enrollList`, {withCredentials: true})
        .then(res => {setEnrollList(res.data)})
        .catch(err => {alert('장바구니 호출 실패')})
    }

    // select에서 클래스 목록 불러오기
    const fetchClassSelect = () => {
        if(!acaId) return;

        axios.get(`/parent/${acaId}/classes`, {withCredentials: true})
        .then(res => {setClasses(res.data)})
        .catch(err => {alert('클래스 호출 실패')});
    }

    //토스 결제로 이어지는 이벤트 함수
    const handleTossPay = (el) => {
        console.log(typeof(el.tuition));
        if (!el || !el.tuition) {
            alert("결제할 내역이 없습니다.");
            return;
        }
        loadTossPayments(clientKey).then((tossPayments) => {
            tossPayments.requestPayment(
                "카드",
                {
                    amount: Number(el.tuition),
                    currency: 'KRW',
                    orderId: `order_${el.enrollId}_${Date.now()}`, //중복 불가
                    orderName: `${el.parentName} 학부모님의 ${el.studentName} 학생의 ${el.duration} 기간 내의 ${el.className} 수업 신청 내역`,
                    customerName: el.parentName,
                    successUrl: `${window.location.origin}/main/success`,
                    failUrl: `${window.location.origin}/main/fail`
                }
            )
            .catch(error => {
                // 에러 처리
                alert('결제 실패!');
                console.error(error);
            });
        });
    };

    //장바구니 목록 개별 삭제
    const handleRemoveEnroll = (enrollId) => {
        if (!window.confirm("정말 삭제하시겠습니까?"))
            return;

        axios.delete(`/parent/deleteEnrollList/${enrollId}`, { withCredentials: true })
        .then(() => {
            alert("삭제되었습니다.");
            // 삭제 후 enrollList 다시 불러오기
            fetchEnrollList();
            fetchPrevList();
        })
        .catch(err => {
            alert("삭제 실패");
            console.error(err);
        });
    }

    //학부모의 기존 결제 내역 불러오기
    const fetchPrevList = () => {
        if(!roleId) return;

        axios.get(`/parent/${roleId}/PrevPay`, {withCredentials: true})
        .then(res => {setPrevPay(res.data)})
        .catch(err => {alert('기존 결제 내역 호출 실패')})
    }

    // acaId(학원) 바뀔 때 1번만 부르기
    useEffect(() => {
        fetchClassSelect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acaId]);
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
                    <span className='title'> 자녀 학원비 결제 </span>
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
                    {/* 수업료 변경 */}
                    <div className='selectParentClass'>
                        <select className='classLabel' style={{ width: '100%' }}
                        value={selClass} onChange={(e) => setSelClass(e.target.value)}>
                            <option value=''> 수업 선택 </option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                            {classes.length === 0 ? (
                                <div>클래스가 없습니다.</div>
                            ):(
                                <table className='enrollreuqest'>
                                    <tbody>
                                    {selectedClass ? (
                                    <React.Fragment key={selectedClass.id}>
                                        <tr>
                                            <td rowSpan={5}>
                                                <div className='ellipse'/>
                                            </td>
                                            <td>강사명 {selectedClass.teacherName}</td>
                                        </tr>
                                        <tr>
                                            <td>{selectedClass.name}</td>
                                        </tr>
                                        <tr>
                                            <td><b>
                                                {selectedClass.tuition
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                            </b></td>
                                        </tr>
                                        <tr>
                                            {/*
                                            똑같이 value와 내용을 맞춰줘야 jackson 직렬화 문제 방지
                                            기간은 학원의 수업의 재량에 따라 천차만별이다.
                                            */}
                                            <select
                                                style={{ width:'70%', textAlign: 'center' }}
                                                value={duration}
                                                onChange={handleEnrollDuration}
                                            >
                                                <option value="2025년 5월">2025년 5월</option>
                                                <option value="2025년 6월">2025년 6월</option>
                                            </select>
                                        </tr>
                                        <tr>
                                            <select
                                                style={{ width:'70%', textAlign: 'center' }}
                                                value={selStudent}
                                                onChange={(e)=>setSelStudent(e.target.value)}
                                            >
                                                <option value="">자녀 선택</option>
                                                {
                                                    students.map(stu => (
                                                        <option key={stu.studentId} value={stu.studentId}>
                                                            {stu.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </tr>
                                    </React.Fragment>
                                    ) : (
                                    <tr>
                                        <td colSpan={2}>수업을 선택해주세요.</td>
                                    </tr>
                                    )}
                                    </tbody>
                                </table>
                            )
                        }
                        <button
                            className='btn insertButton btn-outline-success'
                            onClick={handleEnroll}    
                        >
                            신청하기
                        </button>
                    </div>

                    {/* 수업 신규 등록 */}
                    
                    <div className='insertClass'>
                        <span className='title'> 결제하기  </span>
                        <hr />
                        {/* 이런 식으로 신청하기 버튼을 누르면 뜨게 하기 */}
                        {enrollList.length === 0 ? (
                                <div>신청한 클래스가 없습니다.</div>
                            ):(
                                <table border={0} className='enrollWaitTable'>
                                    <tbody>
                                    {enrollList.map(el=>(
                                        <React.Fragment key={el.id}>
                                            <tr>
                                                <td rowSpan={4}>
                                                    <div className='ellipse'/>
                                                </td>
                                                <td>강사명 {el.teacherName}</td>
                                                <td>{el.duration}</td>
                                            </tr>
                                            <tr>
                                                <td>{el.className}</td>
                                                <td>
                                                    <button onClick={() => handleTossPay(el)}>
                                                        결제
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>
                                                        {el.tuition}원
                                                    </b>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleRemoveEnroll(el.enrollId)}>
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>학생명 {el.studentName}</td>
                                                <td>---</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                    </tbody>
                                </table>
                            )
                        }
                        <button className='btn insertButton btn-outline-success'>결제하기</button>
                    </div>
                </div>    
            </div>  
        </div>
    );
};

export default PaymentPayCheck;