import React from "react";
import { Section } from "./Section.js";
import { TextButton } from "./Button.js";

export const StartScreen = ({onStart}) => {
    return (
        <Section containerStyle={{width: "auto", display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "column"}}>
            <h2 style={{fontFamily: "Open Sans", fontSize: "30px", maxWidth: "60%", textAlign: "center"}}>
                {"Test out the Digial Human Assistant that's being developed at Elisa"}
            </h2>
            <p style={{fontSize: "19px", textAlign: "center", maxWidth: "60%"}}> 
                {"To use the assistant, we need to process your voice so you can communicate with the AI. Your conversation is not recorded."}
            </p>
            <TextButton onClick={onStart}>
                {"I UNDERSTAND"}
            </TextButton>
        </Section>
    )
}