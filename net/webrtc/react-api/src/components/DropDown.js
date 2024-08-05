import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export const Dropdown = ({options, isDropdownOpen, setIsDropdownOpen, handleSelect}) => {
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const [selected, setSelected] = useState(options[0].lang)    

    const handleClickItem = (item) => {
      setSelected(item.lang)
      handleSelect(item)
      setIsDropdownOpen(!isDropdownOpen)
    }

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
          isDropdownOpen && (<div style={{display: "flex", flexFlow: "column", 
                                          overflow: "visible", position: "absolute", 
                                          top: "48px", left: "-1px", borderColor: "#8D8D95", 
                                          borderStyle: "solid", borderWidth: "1px 1px 0px 1px", 
                                          width: "100%", backgroundColor: "#FFF"}}>
              {options.map((item) => (
                  <span onClick={() => handleClickItem(item)} style={{padding: "5px 20px", borderWidth: "0px 0px 1px 0px", borderColor: "#8D8D95", borderStyle: "solid"}} key={item.codeName}>{item.lang}</span>
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