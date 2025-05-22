import React, { useState } from 'react';
import bgImg from "../image/background.png";
import logo from "../image/SquareLogo.png";
import "./Memberstyle.css";
import DaumPostcodeEmbed from 'react-daum-postcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const [openPostCode, setOpenPostCode] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pwdChk, setPwdChk] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [address, setAddress] = useState('');
  const [aca_name, setAca_name] = useState('');
  const [description, setDescription] = useState('');

  const [warning, setWarning] = useState(false);
  const [idCheck, setIdCheck] = useState(false); // true: 가입
  const [pwdCheck, setPwdCheck] = useState(false);

  const navi = useNavigate();

  // 회원가입 이벤트
  const onJoinSubmit = (e) => {
    e.preventDefault();
    if(!idCheck) {
      alert("아이디 체크를 먼저 해주세요.");
      return;
    }

    if(!pwdCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if(address === '') {
      alert("주소를 꼭 입력해주세요");
      return;
    }
    
    axios.post("/public/join",
      {username, password, name, phone, email, aca_name, address, description}
    ).then(res => {
      if(res.data === 'success') {
        navi("/login");
      }
    });
  }


  // 전체 유효성 검사
  const onInvalidCheck = () => {
    setWarning(true);
    btnIdCheck();
    checkPWD();
  }

  // 아이디 유효성 검사
  const btnIdCheck = () => {
    if(username.trim() === '') {
      setIdCheck(false);
      return;
    }

    let url = "/public/idCheck?username="+username;
    axios.get(url).then(res => {
      if(res.data === 'fail') {
        alert("존재하는 아이디");
        setIdCheck(false);
      } else {
        // alert("성공적!");
        setIdCheck(true);
      }
    });
  }

  // 비밀번호 확인
  const checkPWD = () => {
    if(password.trim() === '' || pwdChk.trim() === '') {
      return;
    }

    if(password === pwdChk) {
      setPwdCheck(true);
      return;
    }
  }

  // KaKao 주소 이벤트
  const handle = {
    click:() => {
      setOpenPostCode(current => !current);
    },

    // 주소 선택 시
    selectAddress: (data) => {
      // console.log(data);
      setAddress(`(${data.zonecode})${data.address}`);
      setOpenPostCode(false);
    }
  }

  return (
    <div className="backstyle" style={{backgroundImage: `url(${bgImg})`}}>
      <img alt="" src={logo} className="logo" />
      <p className='joinTitle'>회원가입</p>
      <div className='box2'>
        <form onSubmit={onJoinSubmit}>
          <label>
            이름 설정<br />
            <input type='text' placeholder='이름 입력'
             className='form-control' required
             value={name}
             onChange={(e) => setName(e.target.value)} />
          </label><br />
          <label>
            아이디 설정<br />
            <input type='text' placeholder='아이디 입력'
             className='form-control' required
             value={username}
             onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            비밀번호 설정<br />
            <input type='password' placeholder='비밀번호 입력'
             className='form-control' required
             value={password}
             onChange={(e) => setPassword(e.target.value)} />
            <input type='password' placeholder='비밀번호 확인'
             className='form-control' required
             onChange={(e) => setPwdChk(e.target.value)} />
          </label><br />
          <label>
            개인 정보<br />
            <input type='tel' placeholder='010XXXXYYYY'
             className='form-control' required
             value={phone}
             onChange={(e) => setPhone(e.target.value)} />
            <input type='email' placeholder='square@AAA.com'
             className='form-control' required
             value={email}
             onChange={(e) => setEmail(e.target.value)} />
          </label><br />
          <label>
            학원 정보<br />
            <input type='text' placeholder='학원 주소'
             className='form-control' readOnly required
             value={address}
             onChange={(e)=>setAddress(e.target.value)}
             onClick={handle.click}
             data-bs-toggle="modal" data-bs-target="#AddressModal" />
            
            <input type='text' placeholder='학원명'
             className='form-control' required
             value={aca_name}
             onChange={(e) => setAca_name(e.target.value)} />
            <textarea className='form-control'
             placeholder='학원 설명'
             value={description}
             onChange={(e) => setDescription(e.target.value)}></textarea>
          </label>
          <div className='check'>
            {
              warning && 
              <>
              {(!idCheck||!pwdCheck) && <span className='failed'>적절치 않은 형식입니다.</span>}
              {idCheck && pwdCheck && <span>적절한 형식입니다.</span>}
              </>
            }
            <button type='button' className='btn btn-sm btn-danger'
             onClick={onInvalidCheck}>확인</button>
          </div>
          <button type="submit" className="loginbtn">회원가입</button>
        </form>
      </div>
      {/* 모달 구현 */}
      {
        openPostCode && (
         <div className='modal-overlay'>
          <div className='modal-content'>
            <i class="bi bi-x modal-close"
             onClick={() => setOpenPostCode(false)}></i><br />
            <DaumPostcodeEmbed onComplete={handle.selectAddress}
             autoClose={false}
             defaultQuery='강남대로 94길 20' />
          </div>
         </div> 
        )
      }
    </div>
  );
};

export default JoinPage;