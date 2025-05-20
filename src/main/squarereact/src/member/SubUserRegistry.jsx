import React, { useRef, useState } from "react";
import "./SubUserRegistry.css";

const SubUserRegistry = () => {

  // 날짜 관련
  const dateInputRef = useRef(null);
  const date = new Date().toISOString().slice(0, 16);
  const [defaultDate, defaultTime] = date.split("T");
  const defaults = `${defaultDate} ${defaultTime}:00`;

  const handleIconClick = () => {
    if(dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  }
  
  const [endday, setEndday] = useState(defaults);

  const handleDateChange = (e) => {
    const raw = e.target.value;
    const [date, time] = raw.split("T");
    const formatted = `${date} ${time}:00`;
    setEndday(formatted);
  }


  // 서브계정 폼 이벤트
  const onSubFormEvent = (e) => {
    e.preventDefault();
    alert("헤이");
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
               style={{width:"40%"}} />
            </div>

            <div className="subgroup">
              <span>접근 권한</span>
              <div className="radiobox">
                <label>
                  <input type="radio" name="subcode"
                   defaultChecked />
                  &nbsp;<b>강사</b>
                </label>
                <label>
                  <input type="radio" name="subcode" />
                  &nbsp;<b>학부모</b>
                </label>
              </div>
            </div>

            <div className="subgroup">
              <span>접근 코드</span>
              <input type="text" className="form-control"
               style={{width:"40%"}} />
            </div>
            
            <div className="subgroup">
              <span>사용자 수</span>
              <input type="number" className="form-control"
               style={{width:"40%"}} min="1" max="10" />
            </div>

            <div className="subgroup">
              <span>코드 기한</span>
              <i class="bi bi-calendar4" onClick={handleIconClick}></i>
              <input type="datetime-local" defaultValue={date}
               style={{display:"none"}}
               ref={dateInputRef}
               onChange={handleDateChange} />

              <input type="text" className="form-control"
               style={{width:"30%"}} placeholder="연도.연월.연일 시간"
               value={endday}
               readOnly /> 
            </div>
            <button type="submit" className="codebtn">로그인</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubUserRegistry;
