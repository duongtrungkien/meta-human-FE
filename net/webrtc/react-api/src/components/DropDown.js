import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export const Dropdown = ({options, isDropdownOpen, setIsDropdownOpen}) => {
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const [selected, setSelected] = useState(options[0])    

    return (
      <div style={{display: "flex", 
                alignItems: "center", 
                marginRight: "30px", 
                borderColor: "#8D8D95", 
                borderStyle: "solid", 
                borderWidth: "1px", 
                height: "48px", 
                padding: "0px 20px",
                position: "relative",
        }}>
        {
          isDropdownOpen && (<div style={{display: "flex", flexFlow: "column", overflow: "visible", position: "absolute", top: "50px", left: "10px"}}>
              {options.map((item) => (
                  <span key={item}>{item}</span>
              ))}
          </div>)
        }
        <span style={{width: "124px", height: "24px", fontFamily: "Open Sans", fontSize: "16px"}}>{selected}</span>
        <button style={{backgroundColor: "#0000", border: "none"}} onClick={toggleDropdown}>  
            <FontAwesomeIcon icon={faChevronDown}/>
        </button>
      </div>
    );
  };