import React, { useState } from "react";
import bgImg from "../image/background.png";
import logo from "../image/SquareLogo.png";
import "./Memberstyle.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navi = useNavigate();

  // 로그인 이벤트
  const onLoginSubmit = async (e) => {
    e.preventDefault();

    const url = `/public/login?username=${username}&password=${password}`;

    try {
      const res = await axios.get(url, {withCredentials: true});

      const { username, name, role } = res.data;
      sessionStorage.username = username;
      sessionStorage.name = name;
      sessionStorage.role = role;

      if(isMobile) {
        navi("/m");
      } else {
        navi("/main");
      }
    } catch(err) {
      alert("Login Failed: 아이디 또는 비밀번호를 확인");
    }
  }

  return (
    <div className="backstyle fade-in" style={{backgroundImage: `url(${bgImg})`}}>
      <img alt="" src={logo} className="logo" />
      <div className="box">
        <form onSubmit={onLoginSubmit}>
          <input type="text" placeholder="아이디"
           className="form-control inputs" required
           onChange={(e)=>setUsername(e.target.value)} />
          <input type="password" placeholder="비밀번호"
           className="form-control inputs" required
           onChange={(e)=>setPassword(e.target.value)} />
          <button type="submit" className="loginbtn">로그인</button>
        </form>

        <div className="qbox">
          <Link to="/searchuser"
           className="searchUserInfo">아이디와 비밀번호를 잊으셨나요?</Link>
          <br /><br />
          <button type="button" onClick={()=>navi("/join")}>가입하기</button>
          <button type="button" onClick={()=>navi("/subcode")}>코드 입력</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
