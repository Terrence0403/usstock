let isResizing = false;
// ==========     AI CHAT ROOM    ==========
document.addEventListener("DOMContentLoaded", () => {

    const chatbox = document.getElementById("chatbox");
    const modalOverlay = document.getElementById("modalOverlay");
    const resizeHandle = document.getElementById("resizeHandle");
    const AI_btn = document.getElementById("AI_btn");
    const closeChat = document.getElementById("closeChat");
    const sendMessage = document.getElementById("sendMessage");
    const chatInput = document.getElementById("chatInput");
    const messages = document.getElementById("messages");
    
    // chat room resize
    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        document.body.style.cursor = "ew-resize";
    });
    document.addEventListener("mousemove", (e) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 300 && newWidth < window.innerWidth - 100) {
                chatbox.style.width = `${newWidth}px`;
            }
        }
    });
    document.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = "default";
        }
    });
    // open chat room
    AI_btn.addEventListener("click", () => {
        chatbox.style.display = "flex";
        modalOverlay.style.display = "block";
    });

    // close chat room
    modalOverlay.addEventListener("click", closeChatbox);

    // close chat room
    closeChat.addEventListener("click", closeChatbox);

    // send message
    sendMessage.addEventListener("click", handleSendMessage);

    // send message by pressing Enter
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    });

    // send message function
    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addMessage(messageText, "user");
            ai_assistant(messageText); 
            chatInput.value = ""; 
        }
    }
    // close chat room function
    function closeChatbox() {
        chatbox.style.display = "none";
        modalOverlay.style.display = "none";
    }

    // add message to chat room
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight; 
    }
    function ai_assistant(messageText) {
        fetch('assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: messageText 
            })
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                // console.log(typeof data);
                data = JSON.parse(data);
                const aiMessage = document.createElement("div");
                aiMessage.classList.add("message", "bot");
                aiMessage.textContent = "AI: " + data.text;
                messages.appendChild(aiMessage);
                messages.scrollTop = messages.scrollHeight; 
            })
    }

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
            const viewportHeight = window.visualViewport.height;
            const screenHeight = window.innerHeight;

            if (viewportHeight < screenHeight) {
                // keyboard open
                const keyboardHeight = screenHeight - viewportHeight;
                chatbox.style.bottom = `${keyboardHeight}px`;
            } else {
                // keyboard close
                chatbox.style.bottom = "0px";
            }
        });
    }
    // chat room scroll to bottom
    chatInput.addEventListener("focus", () => {
        setTimeout(() => {
            messages.scrollTop = messages.scrollHeight;
        }, 300);
    });
});

