// ../ui/bubbleCursor.js
export function activateBubbleCursor(parentElement) {
    if (!parentElement) return; // Root.js의 root-container Div를 벗어나면 버블 효과 작동X

    const colours = ["#79D7BE", "#79D7BE", "#79D7BE", "#79D7BE", "#fff"];
    const bubbles = 66;
    const over_or_under = "over";

    let x = 400, y = 300, ox = 400, oy = 300;
    let swide = parentElement.clientWidth;
    let shigh = parentElement.clientHeight;
    let sleft = 0, sdown = 0;
    let bubb = [], bubbx = [], bubby = [], bubbs = [];

    function createDiv(height, width) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = height;
        div.style.width = width;
        div.style.overflow = "hidden";
        div.style.backgroundColor = "transparent";
        return div;
    }

    function buble() {
        if (!document.getElementById) return;
        for (let i = 0; i < bubbles; i++) {
            const rats = createDiv("3px", "3px");
            rats.style.visibility = "hidden";
            rats.style.borderRadius = "50%";
            rats.style.zIndex = over_or_under === "over" ? "1001" : "0";

            let div = createDiv("auto", "auto");
            rats.appendChild(div);
            Object.assign(div.style, {
                top: "1px", left: "0px", bottom: "1px", right: "0px",
                borderLeft: `1px solid ${colours[3]}`,
                borderRight: `1px solid ${colours[1]}`
            });

            div = createDiv("auto", "auto");
            rats.appendChild(div);
            Object.assign(div.style, {
                top: "0px", left: "1px", bottom: "0px", right: "1px",
                borderTop: `1px solid ${colours[0]}`,
                borderBottom: `1px solid ${colours[2]}`
            });

            div = createDiv("auto", "auto");
            rats.appendChild(div);
            Object.assign(div.style, {
                left: "1px", right: "1px", bottom: "1px", top: "1px",
                background: "linear-gradient(180deg, #ffffff 80%, #79D7BE 100%)",
                opacity: 0.7,
                filter: "alpha(opacity=50)",
                borderRadius: "50%"
            });

            parentElement.appendChild(rats);
            bubb[i] = rats.style;
        }
        set_scroll();
        set_width();
        bubble();
    }

    function bubble() {
        if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
            ox = x;
            oy = y;
            for (let c = 0; c < bubbles; c++) {
                if (!bubby[c]) {
                    bubb[c].left = (bubbx[c] = x) + "px";
                    bubb[c].top = (bubby[c] = y - 3) + "px";
                    bubb[c].width = "15px";
                    bubb[c].height = "15px";
                    bubb[c].visibility = "visible";
                    bubbs[c] = 8;
                    break;
                }
            }
        }
        for (let c = 0; c < bubbles; c++) if (bubby[c]) update_bubb(c);
        setTimeout(bubble, 40);
    }

    function update_bubb(i) {
        if (!bubby[i]) return;
        bubby[i] -= bubbs[i] / 2 + i % 2;
        bubbx[i] += (i % 5 - 2) / 5;
        if (bubby[i] > sdown && bubbx[i] > sleft && bubbx[i] < sleft + swide + bubbs[i]) {
            if (Math.random() < bubbs[i] / shigh * 2 && bubbs[i]++ < 12) {
                bubb[i].width = bubbs[i] + "px";
                bubb[i].height = bubbs[i] + "px";
            }
            bubb[i].top = bubby[i] + "px";
            bubb[i].left = bubbx[i] + "px";
        } else {
            bubb[i].visibility = "hidden";
            bubby[i] = 0;
        }
    }

    function mouse(e) {
        if (!e) return;
        const rect = parentElement.getBoundingClientRect();
        // 마우스 위치를 parentElement 내 상대 좌표로 변환
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        set_scroll();
    }

    function set_width() {
        swide = parentElement.clientWidth;
        shigh = parentElement.clientHeight;
    }

    function set_scroll() {
        sdown = 0; // 특정 div 기준이라 스크롤 무시
        sleft = 0;
    }

    document.addEventListener("mousemove", mouse);
    window.addEventListener("resize", set_width);

    buble();

    // 정리 함수 반환 (필요하면 Root.js에서 호출해 해제 가능하게)
    return () => {
        document.removeEventListener("mousemove", mouse);
        window.removeEventListener("resize", set_width);
        // 부모 div에서 버블 제거
        bubb.forEach((style) => {
            if (style.parentElement) {
                parentElement.removeChild(style.parentElement);
            }
        });
    };
}
