import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Root, Main } from '../frame';
import { Attend, AttendHistory, AttendStu } from '../attendBook';
import { JoinPage, LoginPage, SubCode, SubUserRegistry } from '../member';
import { PaymentManagement, NonPayCheck, PaymentPayCheck, PaymentCheck } from '../payment';
import { EvalAdmin, EvalParents, EvalStudent } from '../evaluations';
import { BoardMainPage, BoardMainPostDetail, BoardMainPostForm } from '../Board/Notice';
import { QnABoardMainPage, QnABoardMainPostDetail, QnABoardMainPostForm } from '../Board/QnA';
import ChatbotPage from '../ChatBot/ChatbotPage';

import AttendParent from '../attendBook/AttendParent';
import ClassSetting from '../settings/ClassSetting';
import ClassStudentsManage from '../studentsManage/ClassStudentsManage';
import { AcademyCaller } from '../academycaller';
import { Timetable, CreateTimetable } from '../timetable';
import Error404 from '../error/Error404';

import { Reference, ReferenceWrite, ReferenceDetail, ReferenceEdit, } from '../components/Reference';
import { MyPage } from '../components/Mypage';
import { StudentsManage } from '../studentsManage';


const RouterMain = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root />} />

                <Route path="/main/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                    {/* 수강생 ===================================================================================== */}
                    <Route path="studentsManage" element={<StudentsManage />} />
                    <Route path="students-manage/:acaId" element={<ClassStudentsManage />} /> {/* 수강생 관리 */}

                    <Route path="attend/:acaId" element={<Attend />} /> {/* 출석 관리 */}
                    <Route path="attend/:acaId/attend-history" element={<AttendHistory />} />
                    <Route path="attend-stu/:acaId" element={<AttendStu />} /> {/* 학생 출석 관리 경로 */}
                    <Route path="attend-parent" element={<AttendParent />} /> {/* 학부모 출석 관리 경로 */}

                    <Route path="evaluationAdmin" element={<EvalAdmin/>}/> {/*학원관계자 종합평가 관리 */}
                    <Route path="evaluationParents" element={<EvalParents/>}/> {/*학부모 종합평가 관리 */}
                    <Route path="evaluationStudent" element={<EvalStudent/>}/> {/*학생 종합평가 관리 */}


                    {/* 소통 ======================================================================================= */}
                    <Route path="board" element={<BoardMainPage/>} />
                    <Route path="board/:postId" element={<BoardMainPostDetail/>} />
                    <Route path="post/boardcreate" element={<BoardMainPostForm/>} />
                    <Route path="qnaboard" element={<QnABoardMainPage/>} />
                    <Route path="post/consulting/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/qna/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/faq/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/qnacreate" element={<QnABoardMainPostForm/>} />


                    {/* 수강료 ===================================================================================== */}
                    <Route path="paymentManagement/:acaId" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    <Route path="nonPayCheck/:acaId" element={<NonPayCheck />} /> {/* 원장의 미납자 관리 */}
                    <Route path="paymentCheck/:userId" element={<PaymentCheck />} />
                    <Route path="paymentPayCheck/:acaId/:roleId" element={<PaymentPayCheck />} /> {/* 학부모의 결제와 확인 */}
                    <Route path="subuserregistry" element={<SubUserRegistry />} /> {/* 서브계정 등록 */}

                    {/* 학습 관리 ================================================================================== */}
                    <Route path="timetable" element={<Timetable />} /> {/* 시간표 */}
                    <Route path="timetable/create-timetable" element={<CreateTimetable />} /> {/* 시간표 생성 */}


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

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/subcode" element={<SubCode />} />

                    <Route path="*" element={<Error404 />} /> {/* 404 Error */}

            </Routes>
        </BrowserRouter>
    );
};

export default RouterMain;
