// 检查是否已经定义了 existingDiv 变量
if (!window.existingDiv) {
    // 查找现有的浮动窗口
    window.existingDiv = document.querySelector("#floatingDiv");
}

if (window.existingDiv) {
    // 如果浮动窗口已存在，移除它
    window.existingDiv.remove();
    window.existingDiv = null; // 清除变量
} else {
    // 如果浮动窗口不存在，创建它
    const floatingDiv = document.createElement("div");
    floatingDiv.id = "floatingDiv"; // 添加唯一 ID
    floatingDiv.style.position = "fixed";
    floatingDiv.style.top = "600px";
    floatingDiv.style.left = "40px";
    floatingDiv.style.zIndex = "999";
    floatingDiv.style.width = "200px";
    floatingDiv.style.background = "#fff";
    floatingDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    floatingDiv.style.border = "1px solid #ccc";
    floatingDiv.style.borderRadius = "8px";
    floatingDiv.style.padding = "10px";
    floatingDiv.style.cursor = "move";
    floatingDiv.innerHTML = `
    <button id="toggle">开始语音输入</button>
    <style>
        #floatingDiv {
            position: fixed;
            top: 600px;
            left: 40px;
            z-index: 10000;
            width: 200px;  /* 固定浮动窗口宽度 */
            height: 70px;  /* 固定浮动窗口高度 */
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            box-sizing: border-box;  /* 确保 padding 和 border 不影响外框尺寸 */
        }
        #floatingDiv button {
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;  /* 确保按钮宽度自适应 */
            max-width: 180px;  /* 限制最大宽度，避免按钮变形 */
            height: 50px;  /* 固定按钮高度 */
            border-radius: 4px;
            background-color:rgb(255, 255, 255);
            border: 1px solid #ccc;
            box-sizing: border-box;  /* 确保 padding 和 border 不影响按钮的尺寸 */
        }
    </style>
`;

    document.body.appendChild(floatingDiv);

    // 拖动逻辑
    let isDragging = false;
    let offsetX, offsetY;

    floatingDiv.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - floatingDiv.offsetLeft;
        offsetY = e.clientY - floatingDiv.offsetTop;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            floatingDiv.style.left = `${e.clientX - offsetX}px`;
            floatingDiv.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // 语音输入逻辑
    if (!("webkitSpeechRecognition" in window)) {
        alert("抱歉，您的浏览器不支持语音识别 😞");
    } else {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "zh-CN";

        let isListening = false;
        const button = floatingDiv.querySelector("#toggle");

        recognition.onresult = function (event) {
            const transcript = event.results[event.results.length - 1][0].transcript;
            const activeElement = document.activeElement;

            if (activeElement) {
                if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                    // 处理 <input> 和 <textarea>
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    const text = activeElement.value;
                    activeElement.value = text.slice(0, start) + transcript + text.slice(end);
                    activeElement.selectionStart = activeElement.selectionEnd = start + transcript.length;
                } else if (activeElement.isContentEditable) {
                    // 处理 contenteditable 元素
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(document.createTextNode(transcript));
                        range.collapse(false);
                    }
                }
            }
        };

        button.addEventListener("click", () => {
            if (!isListening) {
                recognition.start();
                button.textContent = "停止语音输入";
            } else {
                recognition.stop();
                button.textContent = "开始语音输入";
            }
            isListening = !isListening;
        });
    }
}
