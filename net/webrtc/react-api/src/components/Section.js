import React from "react";

export const Section = ({children, containerStyle={}}) => {
    return (
        <div style={{...containerStyle, 
                    flex: 1, 
                    borderColor: "#D2D2D6", 
                    borderWidth: "2px", 
                    borderStyle: "solid", 
                    height: "75vh", 
                    width: "50%", 
                    margin: "0px 15px", 
                    padding: "20px"
        }}>
            {children}
        </div>
    )
}