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

  const navi = useNavigate();

  // 경고문 초기화
  const setWarns = () => {
    setWarn1(false);
    setWarn2(false);
    setWarn3(false);
  }

  // 코드 버튼 이벤트
  const clickBtn = () => {
    setWarns();

    if(subcode.trim() === "") {
      setWarn1(true);
      return;
    }

    let url = "/public/subCode?subcode="+encodeURIComponent(subcode);
    axios.get(url).then(res => {
      setWarns();
      setVisible(true);

      setRole(res.data.role);
      setAcademy_id(res.data.academy_id);
      setUsername(res.data.username);
      // alert(res.data.username);
    }).catch(err => {
      if(err.response && err.response.status === 404) {
        setWarn2(true);
      } else {
        setWarn3(true);
      }
    });
  }

  // 패스워드 공백 자동 제거
  const handlePassword = (e) => {
    const raw = e.target.value;
    const trimmed = raw.replace(/\s/g, ''); // 모든 공백 제거
    setPassword(trimmed);
  }

  // 유효성 검사 - 비동기 함수로 변경
  const validationEvent = async () => {
    let idOk = false;
    let pwdOk = false;
    
    setWarns(); // 경고문 초기화

    try {
      const url = `/public/idCheck?username=${username}`;
      const res = await axios.get(url);

      if(res.status === 200 && res.data.available) {
        idOk = true;
      }
    } catch(err) {
      if(err.response && err.reponse.status === 409) {
        // 아이디 중복
        setWarn1(true);
      } else {
        setWarn3(true);
      }
    }

    // 패스워드
    if(password.trim() === '' || pwdChk.trim() === '') {
      setWarn2(true);
    } else if(password !== pwdChk) {
      setWarn2(true);
    } else {
      pwdOk = true;
    }

    return idOk && pwdOk;
  }

  // 서브계정 회원가입 폼 이벤트
  const onSubJoinEvent = async (e) => {
    e.preventDefault();
    const isValid = await validationEvent(); // 비동기 유효성 검사

    if(!isValid) {
      return;
    }

    try {
      await axios.post("/public/subJoin", {
        subcode, role, academy_id, name, username, password,
        phone, email, subject
      });

      navi("/login");
    } catch(err) {
      setWarn3(true);
    }

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
             className="form-control inputs" readOnly
             value={username} />
            
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
            {
              role === "ROLE_STUDENTS" &&
              <></>
            }
            <button type="submit" className="loginbtn">회원 가입</button>
          </form>
          {warn1 && <span className="subCodeFail">코드를 다시 입력해주세요.</span>}
          {warn2 && <span className="subCodeFail">비밀번호가 다릅니다.</span>}
          {warn3 && <span className="subCodeFail">서버 오류...</span>}
        </div>
      }
    </div>
  );
};

export default SubCode;