import React, { useRef, useState } from "react";
import "./SubUserRegistry.css";
import axios from "axios";

const SubUserRegistry = () => {
  // 경고문
  const [warn1, setWarn1] = useState(false);
  const [warn2, setWarn2] = useState(false);
  const [warn3, setWarn3] = useState(false);
  // 경고문 초기화
  const setWarns = () => {
    setWarn1(false);
    setWarn2(false);
    setWarn3(false);
  }

  // code 폼 값
  const [code, setCode] = useState('');
  const [role, setRole] = useState('ROLE_TEACHER');
  const [subcode, setSubcode] = useState('');
  const [people, setPeople] = useState(1);
  

  // 날짜 관련
  const dateInputRef = useRef(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 16);
  const [defaultDate, defaultTime] = date.split("T");
  const defaults = `${defaultDate} ${defaultTime}:00`;
  const [formatDay, setFormatDay] = useState(defaults);

  const handleIconClick = () => {
    if(dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  }
  
  // api로 보낼 값
  const username = sessionStorage.getItem("username").toString();
  const [endday, setEndday] = useState(date);

  const handleDateChange = (e) => {
    const raw = e.target.value;
    setEndday(raw);

    // ui 시간 변경
    const [date, time] = raw.split("T");
    const formatted = `${date} ${time}:00`;
    setFormatDay(formatted);
    // console.log(endday);
  }


  // 서브계정 폼 이벤트
  const onSubFormEvent = (e) => {
    e.preventDefault();
    setWarns();

    axios({
      method: 'post',
      url: '/dir/inputCode',
      data: {subcode, people, role, endday, username, code},
      withCredentials: true // 쿠키로 JWT 토큰 이동
    }).then(res => {
      alert(`${subcode} 코드 생성 완료!`);
      setCode('');
      setSubcode('');
      setPeople(1);
    }).catch(err => {
      if(err.response && err.response.status === 400) {
        setWarn1(true);
        return;
      }

      if(err.response && err.response.status === 404) {
        setWarn2(true);
        return;
      } 

      setWarn3(true);
    });
  }

  return (
    <div className="subContainer">
      <div className="subContainer2">
        <span className="title"> 서브 계정 설정 </span>
        <div className="subTitle">
          <span> 학원 코드 값이 같을 때에만 계정을 생성하실 수 있습니다. </span>
        </div>

        <div className="subContent">
          <form onSubmit={onSubFormEvent}>
            <div className="subgroup">
              <span>학원 코드</span>
              <input type="text" className="form-control"
               style={{width:"40%"}} required
               value={code} onChange={(e) => setCode(e.target.value)} />
              {warn1 && <p className="subCodeFail">누구인가?</p>}
              {warn2 && <p className="subCodeFail">코드가 맞지 않습니다.</p>}
              {warn3 && <p className="subCodeFail">서버 오류...</p>}
            </div>

            <div className="subgroup">
              <span>접근 권한</span>
              <div className="subRadioBox" onChange={(e) => setRole(e.target.value)}>
                <label>
                  <input type="radio" name="subcode"
                   value="ROLE_TEACHER"
                   defaultChecked />
                  &nbsp;<b>강사</b>
                </label>
                <label>
                  <input type="radio" name="subcode"
                   value="ROLE_PARENT" />
                  &nbsp;<b>학부모</b>
                </label>
              </div>
            </div>

            <div className="subgroup">
              <span>접근 코드</span>
              <input type="text" className="form-control"
               style={{width:"40%"}} required
               maxLength={10}
               value={subcode} onChange={(e) => setSubcode(e.target.value)} />
            </div>
            
            <div className="subgroup">
              <span>사용자 수</span>
              <input type="number" className="form-control"
               style={{width:"40%"}} min="1" max="10"
               value={people} onChange={(e) => setPeople(e.target.value)} />
            </div>

            <div className="subgroup">
              <span>코드 기한</span>
              <div className="calendar-wrapper">
                <i className="bi bi-calendar4" onClick={handleIconClick}></i>
                <input type="datetime-local" defaultValue={date}
                style={{display:"none"}}
                ref={dateInputRef}
                onChange={handleDateChange} />

                <input type="text" className="form-control"
                style={{width:"30%"}} placeholder="연도.연월.연일 시간"
                value={formatDay}
                readOnly /> 
            </div>
            </div>
            <button type="submit" className="codebtn">코드 등록</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubUserRegistry;
