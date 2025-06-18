import { useEffect } from "react";
import './successPage.css';
import { useNavigate, useSearchParams } from "react-router-dom";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const paymentKey = searchParams.get("paymentKey");

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    //orderId에서 enrollId 추출
    // const orderId = searchParams.get("orderId");
    let enrollId = null;
    if (orderId && orderId.startsWith("order_")) {
      // orderId: order_{가져올값}_{시간}
      enrollId = orderId.split('_')[1]; 
    }
    
    const requestData = {
      orderId,
      amount,
      paymentKey,
      enrollId, // 추가!
    };

    async function confirm() {
      const response = await fetch("/parent/confirm", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }
    }
    confirm();
  }, [navigate, orderId, amount, paymentKey]);

  return (
    <div className="result wrapper">
      <div className="box_section">
            <h2>
              결제 완료!
            </h2>

            <div className='payInfo'>
                  <span className='graytext'> 결제 내역 상세 </span>
                  <hr />

                  <div className="row">
                      <span className="payInfoItem"> 결제 번호 </span>
                      <span className="payInfoContent"> {searchParams.get("orderId")} </span>
                  </div>
                  <div className="row">
                      <span className="payInfoItem"> 결제 금액 </span>
                      <span className="payInfoContent"> {Number(searchParams.get("amount")).toLocaleString()}원 </span>
                  </div>
                  <div className="row">
                      <span className="payInfoItem"> paymentKey </span>
                      <span className="payInfoContent"> {searchParams.get("paymentKey")} </span>
                  </div>
                  <hr />
            </div>
        </div>
    </div>
  );
}