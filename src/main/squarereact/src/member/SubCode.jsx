import React, { useState } from 'react';
import bgImg from "../image/background.png";
import logo from "../image/SquareLogo.png";
import "./Memberstyle.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubCode = () => {
  const [subcode, setSubcode] = useState(''); // 서브 코드
  // 서브계정 필요 정보
  const [role, setRole] = useState('');
  const [academy_id, setAcademy_id] = useState(1);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pwdChk, setPwdChk] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [subject, setSubject] = useState('');

  // 경고문
  const [warn1, setWarn1] = useState(false);
  const [warn2, setWarn2] = useState(false);
  const [warn3, setWarn3] = useState(false);

  const [visible, setVisible] = useState(false); // 회원가입 폼

  // 유효성 검사 - true 가입
  const [idCheck, setIdCheck] = useState(false);
  const [pwdCheck, setPwdCheck] = useState(false);

  const navi = useNavigate();

  // 경고문 초기화
  const setWarns = () => {
    setWarn1(false);
    setWarn2(false);
    setWarn3(false);
  }

  // 코드 버튼 이벤트
  const clickBtn = () => {
    if(subcode.trim() === "") {
      setWarn1(true);
      return;
    }

    let url = "/public/subCode?subcode="+subcode;
    axios.get(url).then(res => {
      setWarns();
      setVisible(true);

      setRole(res.data.role);
      setAcademy_id(res.data.academy_id);
      // alert(res.data.role);
      // alert(res.data.academy_id);
    }).catch(err => {
      if(err.response && err.response.status === 404) {
        setWarn2(true);
      } else {
        setWarn3(true);
      }
    });
  }

  // 아이디 공백 자동 제거
  const handleUsername = (e) => {
    const raw = e.target.value;
    const trimmed = raw.replace(/\s/g, ''); // 모든 공백 제거
    setUsername(trimmed);
  }
  const handlePassword = (e) => {
    const raw = e.target.value;
    const trimmed = raw.replace(/\s/g, ''); // 모든 공백 제거
    setPassword(trimmed);
  }

  // 유효성 검사
  const validationEvent = () => {
    // 아이디
    let url = "/public/idCheck?username="+username;
    axios.get(url).then(res => {
      if(res.data === 'fail') {
        setIdCheck(false);
        setWarn1(true);
      } else {
        setIdCheck(true);
      }
    });

    // 패스워드
    if(password.trim() === '' || pwdChk.trim() === '') {
      setPwdChk(true);
      setWarn2(true);
    }

    if(password === pwdChk) {
      setPwdCheck(true);
      setWarn2(true);
    }
  }

  // 서브계정 회원가입 폼 이벤트
  const onSubJoinEvent = (e) => {
    e.preventDefault();
    setWarns();
    validationEvent();

    if(!idCheck || !pwdCheck) {
      return;
    }

    axios.post("/public/subJoin", 
      {subcode, role, academy_id, name, username, password,
         phone, email, subject}
    ).then(res => {
      navi("/login");
    }).catch(err => {
      setWarn3(true);
    });
  }

  return (
    <div className="backstyle" style={{backgroundImage: `url(${bgImg})`}}>
      <img alt="" src={logo} className="logo" />
      {
        !visible ?
        <div className="subcodebox">
          <input type="text" placeholder="코드 입력"
           className="form-control inputs"
           maxLength={10} value={subcode}
           onChange={(e) => setSubcode(e.target.value)} />
          <button type="button" className="loginbtn"
           onClick={clickBtn}>코드 입력</button>

          {warn1 && <span className="subCodeFail">코드를 꼭 입력하세요.</span>}
          {warn2 && <span className="subCodeFail">올바른 코드를 입력하세요.</span>}
          {warn3 && <span className="subCodeFail">서버 오류...</span>}
        </div> 
        :
        // 서브 계정 폼
        <div className="subjoinbox">
          <form onSubmit={onSubJoinEvent}>
            <label>이름 설정</label>
            <input type="text" placeholder="이름"
             className="form-control inputs" required
             value={name} onChange={(e)=>setName(e.target.value)} />
            <label>계정 정보</label>
            <input type="text" placeholder="아이디"
             className="form-control inputs" required
             value={username} onChange={handleUsername} />
            
            <input type="password" placeholder="비밀번호"
             className="form-control inputs" required
             value={password} onChange={handlePassword} />
            <input type="password" placeholder="비밀번호 확인"
             className="form-control inputs" required
             value={pwdChk} onChange={(e)=>setPwdChk(e.target.value)} />

            <input type="tel" placeholder="핸드폰 번호(- 없이 작성)"
             className="form-control inputs" required
             value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <input type="email" placeholder="이메일"
             className="form-control inputs" required
             value={email} onChange={(e)=>setEmail(e.target.value)} />
            
            {/* 코드 관련 권한에 따른 변화 */}
            {
              
              role === "ROLE_TEACHER" &&
              <>
                <label>담당 과목</label>
                <input type="text" placeholder="담당 과목"
                 className="form-control inputs" required
                 value={subject} onChange={(e)=>setSubject(e.target.value)} />
              </>
            }
            {
              role === "ROLE_PARENT" &&
              <></>
            }
            <button type="submit" className="loginbtn">회원 가입</button>
          </form>
          {warn1 && <span className="subCodeFail">존재하는 아이디입니다.</span>}
          {warn2 && <span className="subCodeFail">비밀번호가 다릅니다.</span>}
          {warn3 && <span className="subCodeFail">서버 오류...</span>}
        </div>
      }
    </div>
  );
};

export default SubCode;