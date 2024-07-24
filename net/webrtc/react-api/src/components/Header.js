import React from "react";
import { useState } from "react";
import { Dropdown } from "./DropDown.js";

export const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    

    return (
        <div style={{display: "flex", 
                    flexFlow: "row", 
                    height: "18%",
                    width: "100%", 
                    justifyContent: "space-between", 
                    padding: "0px 15px",
                    alignItems: "center"
        }}>
            <h1 style={{fontFamily: "Open Sans"}}>Elisa Reception Assistant</h1>
            <Dropdown options={["English", "Finish"]}  isDropdownOpen={isDropdownOpen} setIsDropdownOpen={(value) => {setIsDropdownOpen(value)}}/>
        </div>
    )
}