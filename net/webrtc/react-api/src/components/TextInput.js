import React from "react";
import { useState } from "react";
import { TextButton, IconButton } from "./Button.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'


export const TextInput = ({onSend, onTalk, onReset}) => {
    const [text, setText] = useState("")

    const handleSend = () => {
        onSend(text)
        setText("")
    }

    const handleReset = () => {
        onReset()
        setText("")
    }

    return (
        <div style={{display: "flex", flexFlow: "row", height: "48px", width: "100%"}}>
            <IconButton onClick={handleReset}>
                <FontAwesomeIcon icon={faCircleQuestion} style={{fontSize: "24px"}}/>
            </IconButton>
            <input style={{height: "46px", width: "100%", 
                        margin: "0px 0px", borderStyle: "solid", 
                        borderColor: "#8D8D95", borderWidth: "1px",
                        padding: "0px 5px"
                    }} 
                    onChange={(event) => {setText(event.target.value)}} value={text}/>
            <IconButton onClick={onTalk}>
                <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "24px"}}/>
            </IconButton>
            <TextButton onClick={handleSend}>SEND</TextButton>
        </div>
    )
}