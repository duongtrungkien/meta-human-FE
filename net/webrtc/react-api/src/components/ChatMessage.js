import React from "react";

export const ChatMessage = ({message}) => {
    return (<div style={{
        backgroundColor: message.sender === "ai" ? "#FFF" : "#DEEDFF",
        justifySelf: message.sender === "ai" ? "start" : "end",
        padding: "12px 8px 8px 8px",
        boxShadow: "1px 2px 2px 1px #D2D2D6",
        fontFamily: "Open Sans",
        fontSize: "16px",
        width: "50%",
        margin: "7px 2px 3px 2px",
        height: "fit-content"
    }}>
        <p>{message.content}</p>
    </div>
    )
}