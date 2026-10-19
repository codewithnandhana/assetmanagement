import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chatbot.css";

function Chatbot() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [chats, setChats] = useState([]);
    const [openChat, setOpenChat] = useState(null);

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem("access");

            const res = await axios.get(
                "/api/chat/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setChats(res.data);
        } catch (error) {
            console.log("GET CHAT ERROR:", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const sendMessage = async () => {
        if (!prompt.trim()) return;

        try {
            const token = localStorage.getItem("access");

            const res = await axios.post(
                "/api/chat/",
                {
                    prompt: prompt
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResponse(res.data.response);
            setPrompt("");

            fetchChats();
        } catch (error) {
            console.log("CHAT ERROR:", error);
        }
    };

    return (
        <div className="chatbot-page">

            {/* LEFT SIDE */}
            <div className="chat-main">

                <div className="chat-header">
                    <h2>AI Chatbot</h2>
                    <p>Ask anything about your asset management system</p>
                </div>

                <div className="chat-answer">
                    {response ? (
                        <>
                            <div className="answer-title">AI Response</div>
                            <p>{response}</p>
                        </>
                    ) : (
                        <div className="empty-chat">
                            <h3>How can I help you?</h3>
                            <p>Ask a question to get started.</p>
                        </div>
                    )}
                </div>

                <div className="chat-input-area">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        placeholder="Ask something..."
                    />

                    <button onClick={sendMessage}>
                        Send
                    </button>
                </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="chat-history-panel">

                <div className="history-header">
                    <h3>Chat History</h3>
                    <span>{chats.length} chats</span>
                </div>

                <div className="history-list">

                    {chats.length === 0 ? (
                        <p className="no-history">
                            No chat history yet.
                        </p>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="history-item"
                            >

                                <button
                                    className="question-button"
                                    onClick={() =>
                                        setOpenChat(
                                            openChat === chat.id
                                                ? null
                                                : chat.id
                                        )
                                    }
                                >
                                    <span>{chat.prompt}</span>

                                    <span className="arrow">
                                        {openChat === chat.id ? "▲" : "▼"}
                                    </span>
                                </button>

                                {openChat === chat.id && (
                                    <div className="history-answer">
                                        <strong>AI</strong>
                                        <p>{chat.response}</p>
                                    </div>
                                )}

                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
}

export default Chatbot;