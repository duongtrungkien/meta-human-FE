import React from "react";
import { TextInput } from "./TextInput.js";
import { ChatMessage } from "./ChatMessage.js";

export const ConversationBox = ({conversation, onSend, onTalk, onReset}) => {
    return (
        <div style={{display: "flex", flexFlow:"column", justifyContent: "flex-end", height: "100%"}}>
            <div className="hiddenscroll" style={{overflow: "scroll", height: "fit-content", display: "grid", marginBottom: "10px"}}>
                {conversation.map((message, index) => {
                    return <ChatMessage key={index} message={message}/>
                })}
            </div>
            <TextInput onSend={onSend} onReset={onReset} onTalk={onTalk}/>
        </div>
    )
}