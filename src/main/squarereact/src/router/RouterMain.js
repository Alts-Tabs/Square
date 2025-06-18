import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Root, Main } from '../frame';
import { Attend, AttendHistory, AttendStu } from '../attendBook';
import { JoinPage, LoginPage, SearchUser, SubCode, SubUserRegistry } from '../member';
import { PaymentManagement, NonPayCheck, PaymentPayCheck, PaymentCheck } from '../payment';
import { EvalAdmin, EvalParents, EvalStudent } from '../evaluations';
import { BoardMainPage, BoardMainPostDetail, BoardMainPostForm } from '../Board/Notice';
import ChatbotPage from '../ChatBot/ChatbotPage';

import ClassSetting from '../settings/ClassSetting';
import { AcademyCaller, Consultation } from '../academycaller';
import { Timetable, CreateTimetable, UpdateTimetable } from '../timetable';
import Error404 from '../error/Error404';

import { Reference, ReferenceWrite, ReferenceDetail, ReferenceEdit, } from '../components/Reference';
import { MyPage } from '../components/Mypage';

import { SuccessPage } from '../payment/SuccessPage';
import { FailPage } from '../payment/FailPage';
import { StudentsManage, TeachersManage, ClassStudentsManage } from '../studentsManage';
import { MobileAttendStu, MobileCalendar, MobileMypage, MobileNavi, MobileTimetable } from '../mobile';
import BoardEditer from '../Board/Notice/BoardEditer';

const RouterMain = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root />} />

                <Route path="/main/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                    <Route path='' element={<AcademyCaller />} />
                    {/* 수강생 ===================================================================================== */}
                    <Route path="studentsManage" element={<StudentsManage />} />
                    <Route path="teachersManage" element={<TeachersManage />} /> {/* 원장 - 강사들 관리 */}
                    <Route path="students-manage/:acaId" element={<ClassStudentsManage />} /> {/* 수강생 관리 */}

                    <Route path="attend/:acaId/" element={<Attend />} /> {/* 출석 관리 */}
                    <Route path="attend/:acaId/attend-history/:timetableAttendIdx" element={<AttendHistory />} />
                    <Route path="attend-stu/:acaId" element={<AttendStu />} /> {/* 학생 출석 관리 경로 */}

                    <Route path="evaluationAdmin" element={<EvalAdmin/>}/> {/*학원관계자 종합평가 관리 */}
                    <Route path="evaluationParents" element={<EvalParents/>}/> {/*학부모 종합평가 관리 */}
                    <Route path="evaluationStudent" element={<EvalStudent/>}/> {/*학생 종합평가 관리 */}


                    {/* 소통 ======================================================================================= */}
                    <Route path="board" element={<BoardMainPage/>} />
                    <Route path="board/:postId" element={<BoardMainPostDetail/>} />
                    <Route path="post/boardcreate" element={<BoardMainPostForm/>} />
                    <Route path="post/BoardEditer" element={<BoardEditer/>} />
                    <Route path='consultation' element={<Consultation />} />


                    {/* 수강료 ===================================================================================== */}
                    <Route path="paymentManagement/:acaId" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    <Route path="nonPayCheck/:acaId" element={<NonPayCheck />} /> {/* 원장의 미납자 관리 */}
                    <Route path="paymentCheck/:roleId" element={<PaymentCheck />} />
                    <Route path="paymentPayCheck/:acaId/:roleId" element={<PaymentPayCheck />} /> {/* 학부모의 결제와 확인 */}
                    <Route path="subuserregistry" element={<SubUserRegistry />} /> {/* 서브계정 등록 */}
                    <Route path="success" element={<SuccessPage/>} />
                    <Route path="fail" element={<FailPage/>} />

                    {/* 학습 관리 ================================================================================== */}
                    <Route path="timetable" element={<Timetable />} /> {/* 시간표 */}
                    <Route path="timetable/create-timetable" element={<CreateTimetable />} /> {/* 시간표 생성 */}
                    <Route path="timetable/update-timetable" element={<UpdateTimetable/>} /> {/*시간표 수정 */}


                    {/* 학원 정보 ================================================================================== */}
                    <Route path="class-setting/:acaId" element={<ClassSetting />} /> {/* 클래스 관리 */}
                    <Route path="academycaller" element={<AcademyCaller />} />{/* 학원 관리 */}


                    {/* 챗봇 ================================================================================== */}
                    <Route path="chat" element={<ChatbotPage/>}></Route>

                    <Route path="reference">
                        <Route index element={<Reference />} /> {/*자료실 메인 */}
                        <Route path="write" element={<ReferenceWrite />} /> {/*자료실 글쓰기 */}
                        <Route path=":fileId" element={<ReferenceDetail />} /> {/*자료실 상세보기 */}
                        <Route path=":fileId/edit" element={<ReferenceEdit />} /> {/*자료실 글수정 */}
                    </Route>

                    <Route path="mypage" element={<MyPage />} /> {/*마이페이지 */}
                </Route>

                {/* 404 Error & 로그인 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/subcode" element={<SubCode />} />
                <Route path='/searchuser' element={<SearchUser />} />
                <Route path="*" element={<Error404 />} />

                {/* 모바일 */}
                <Route path="/m/" element={<MobileNavi />}>
                    <Route path='' element={<MobileTimetable />} />
                    <Route path='calendar' element={<MobileCalendar />} />
                    <Route path='mypage' element={<MobileMypage />}/>
                    <Route path='timetable' element={<MobileTimetable/>}/>
                    <Route path='attend-student/:acaId' element={<MobileAttendStu/>} /> {/*학생 출석 관리 */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default RouterMain;
