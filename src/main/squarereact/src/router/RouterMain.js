import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../components/Main';
import Attend from '../components/Attend';
import AttendHistory from '../components/AttendHistory';
import { JoinPage, LoginPage, SubUserRegistry } from '../member';
import PaymentManagement from '../components/PaymentManagement';
import { EvalAdmin, EvalParents, EvalStudent } from '../evaluations';
import BoardMainPage from '../components/BoardMainPage';
import PostDetail from '../components/PostDetail';
import PostForm from '../components/PostForm';

const RouterMain = () => {  

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}> {/* Header & Navi 레이아웃 */}
                    <Route path="/attend" element={<Attend />} /> {/* attend 경로 */}
                    <Route path="/attend-history" element={<AttendHistory />} />
                    <Route path="/paymentManagement" element={<PaymentManagement />} /> {/* 원장의 수업 수강료 관리창 */}
                    <Route path="subuserregistry" element={<SubUserRegistry />} /> {/* 서브계정 등록 */}
                    <Route path="evaluationAdmin" element={<EvalAdmin/>}/> {/*학원관계자 종합평가 관리 */}
                    <Route path="evaluationParents" element={<EvalParents/>}/> {/*학부모 종합평가 관리 */}
                    <Route path="evaluationStudent" element={<EvalStudent/>}/> {/*학생 종합평가 관리 */}
                    <Route path="/board" element={<BoardMainPage/>} />
                    <Route path="/post/:postId" element={<PostDetail/>} />
                    <Route path="/post/create" element={<PostForm/>} />  
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/join" element={<JoinPage />} />                                               
            </Routes>
        </BrowserRouter>
    );
};

export default RouterMain;