import React from "react";

export const TextButton = ({onClick, children}) => {
    return (
        <button className="textbutton" style={{padding: "14px 32px", border: "none", borderRadius: "4px", backgroundColor: "#005FED", fontFamily: "Open Sans", fontSize: "14px", color: "#FFF"}} onClick={onClick}>
            {children}
        </button>
    )
}

export const IconButton = ({onClick, children}) => {
    return (
        <button className="iconbutton" style={{padding: "0px 15px", border: "none", backgroundColor: "#FFF", textAlign: "center"}} onClick={onClick}>
            {children}
        </button>
    )
}