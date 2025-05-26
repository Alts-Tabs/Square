import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Root, Main } from '../frame';
import { Attend, AttendHistory, AttendStu } from '../attendBook';
import { JoinPage, LoginPage, SubCode, SubUserRegistry } from '../member';
import { PaymentManagement, NonPayCheck } from '../components/payment';
import { EvalAdmin, EvalParents, EvalStudent } from '../evaluations';
import { BoardMainPage, BoardMainPostDetail, BoardMainPostForm } from '../Board/Notice';
import { QnABoardMainPage, QnABoardMainPostDetail, QnABoardMainPostForm } from '../Board/QnA';
import AttendParent from '../attendBook/AttendParent';
import ClassSetting from '../settings/ClassSetting';

const RouterMain = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root />} />

                <Route path="/main/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                    <Route path="attend" element={<Attend />} /> {/* attend 경로 */}
                    <Route path="attend/attend-history" element={<AttendHistory />} />
                    <Route path="attend-stu" element={<AttendStu />} /> {/* 학생 로그인 경로 */}
                    <Route path="attend-parent" element={<AttendParent />} /> {/* 학부모 로그인 경로 */}

                    <Route path="paymentManagement" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    <Route path="nonPayCheck" element={<NonPayCheck />} /> {/* 원장의 미납자 관리 */}
                    <Route path="subuserregistry" element={<SubUserRegistry />} /> {/* 서브계정 등록 */}

                    <Route path="evaluationAdmin" element={<EvalAdmin/>}/> {/*학원관계자 종합평가 관리 */}
                    <Route path="evaluationParents" element={<EvalParents/>}/> {/*학부모 종합평가 관리 */}
                    <Route path="evaluationStudent" element={<EvalStudent/>}/> {/*학생 종합평가 관리 */}

                    <Route path="board" element={<BoardMainPage/>} />
                    <Route path="board/:postId" element={<BoardMainPostDetail/>} />
                    <Route path="post/boardcreate" element={<BoardMainPostForm/>} />
                    <Route path="qnaboard" element={<QnABoardMainPage/>} />
                    <Route path="post/consulting/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/qna/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/faq/:postId" element={<QnABoardMainPostDetail />} />
                    <Route path="post/qnacreate" element={<QnABoardMainPostForm/>} />

                    <Route path="class-setting/:acaId" element={<ClassSetting />} /> {/* 클래스 관리 */}

                </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/subcode" element={<SubCode />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouterMain;
