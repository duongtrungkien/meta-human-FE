import React from "react";
import { useState } from "react";
import { Dropdown } from "./DropDown.js";

export const Header = ({setLanguage}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const languageOptions = [{lang: "English", codeName: "en-US"}, {lang: "Finnish", codeName: "fi-FI"}]
    const handleSelect = (item) => {
        setLanguage(item.codeName)
    }

    return (
        <div style={{display: "flex", 
                    flexFlow: "row", 
                    height: "18%",
                    width: "100%", 
                    justifyContent: "space-between", 
                    padding: "0px 15px",
                    alignItems: "center"
        }}>
            <h1 style={{fontFamily: "Open Sans"}}>Elisa Digital Human</h1>
            {/* <Dropdown options={languageOptions}  isDropdownOpen={isDropdownOpen} setIsDropdownOpen={(value) => {setIsDropdownOpen(value)}} handleSelect={handleSelect}/> */}
        </div>
    )
}