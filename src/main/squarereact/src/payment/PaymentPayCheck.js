import React, { useEffect, useState } from 'react';
import './PaymentPayCheck.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPayCheck = () => {
    const { acaId, parentId } = useParams();

    const [classes, setClasses] = useState([]);
    const [selClass, setSelClass] = useState([]);
    const selectedClass = classes.find(cls => String(cls.id) === String(selClass));

    //수업을 들을 자녀를 선택
    const [students, setStudents] = useState([]);
    const [selStudent, setSelStudent] = useState('');

    useEffect(() => {
        if (!parentId) return;
        axios.get(`/parent/${parentId}/students`, { withCredentials: true })
            .then(res => setStudents(res.data))
            .catch(err => alert('자녀 목록 호출 실패'));
    }, [parentId]);

    // const handleEnroll = () => {
    //     if (!selClass || !selStudent) return alert('수업/자녀를 선택하세요');
    //     axios.post(`/parent/payment/${acaId}/${parentId}`, {
    //         classId: selClass,
    //         parentId,
    //         studentId: selStudent
    //     }, { withCredentials: true })
    //         .then(res => { /* enroll 리스트 추가 등 */ })
    //         .catch(err => alert('신청 실패'));
    // };


    // 클래스 목록 불러오기
    const fetchClassSelect = () => {
        if(!acaId) return;

        axios.get(`/parent/${acaId}/classes`, {withCredentials: true})
        .then(res => {setClasses(res.data)})
        .catch(err => {alert('클래스 호출 실패')});
    }

    // acaId(학원) 바뀔 때 1번만 부르기
    useEffect(() => {
        fetchClassSelect();
    }, [acaId]);
    
    return (
        <div>
           <div className='paymentManagementContainer'>    
                <div className='leftContainer'>
                    {/* 오늘의 출석 */}
                    <span className='title'> 자녀 학원비 결제 </span>
                    <div className='PrevPayclassRead'>
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


                <div className='rightPCContainer'>
                    {/* 수업료 변경 */}
                    <div className='selectParentClass'>
                        <select className='classFilter' style={{ width: '100%' }}
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
                                            <select style={{ width:'70%', textAlign: 'center' }}>
                                                <option value="may">2025년 5월</option>
                                                <option value="june">2025년 6월</option>
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
                        <button className='btn insertButton btn-outline-success'>신청하기</button>
                    </div>

                    {/* 수업 신규 등록 */}
                    <span className='title'> 결제 하기  </span>
                    <div className='insertClass'>
                        {/* 이런 식으로 신청하기 버튼을 누르면 뜨게 하기 */}
                        {/* {classes.length === 0 ? (
                                <div>클래스가 없습니다.</div>
                            ):(
                                <table className='enrollreuqest'>
                                    <tbody>
                                    {selectedClass ? (
                                    <React.Fragment key={selectedClass.id}>
                                        <tr>
                                            <td rowSpan={4}>
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
                                            <select style={{ width:'70%', textAlign: 'center' }}>
                                                <option value="may">2025년 5월</option>
                                                <option value="june">2025년 6월</option>
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
                        } */}
                        <button className='btn insertButton btn-outline-success'>결제하기</button>
                    </div>
                </div>    
            </div>  
        </div>
    );
};

export default PaymentPayCheck;