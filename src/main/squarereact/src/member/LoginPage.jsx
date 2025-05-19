import React, { useState } from "react";
import bgImg from "../image/background.png";
import logo from "../image/SquareLogo.png";
import "./Memberstyle.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navi = useNavigate();

  // 로그인 이벤트
  const onLoginSubmit = (e) => {
    e.preventDefault();

    let url = "/public/login?username="+username+"&password="+password;
    axios.get(url).then(res => {
      if(res.data.token == null) {
        alert("Invalid Data!");
      } else {
        sessionStorage.token = res.data.token;
        sessionStorage.username = res.data.username;
        sessionStorage.name = res.data.name;
        sessionStorage.role = res.data.role;
        alert("로그인");
        navi("/");
      }
    });
  }

  return (
    <div className="backstyle" style={{backgroundImage: `url(${bgImg})`}}>
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
          <p>아이디와 비밀번호를 잊으셨나요?</p>
          <br />
          <button type="button" onClick={()=>navi("/join")}>가입하기</button>
          <button type="button">코드 입력</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
