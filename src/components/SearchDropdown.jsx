import React, { useState, useEffect, Children } from "react";
import {
  CCol,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from "@coreui/react";

const SearchDropdown = ({
  options,
  onSelect,
  onChange,
  loading,
  placeholder,
  reset,
  id,
  c = "",
}) => {
  const [className, setClassName] = useState("floating-dropdown-hide");
  const [value, setValue] = useState({ title: "" });
  const [array, setArray] = useState([]);
  const showDropdown = () => {
    setClassName("floating-dropdown-show");
  };

  const onSelectValue = (e) => {
    setValue(e);
    setClassName("floating-dropdown-hide");
    onSelect(e);
  };
  const onChangeValue = (e) => {
    setValue({ title: e.target.value });
    onChange && onChange(e.target.value);
  };

  document.addEventListener("click", () => {
    className === "floating-dropdown-show" &&
      !document.activeElement.className.includes("dropdown-input") &&
      setClassName("floating-dropdown-hide");
  });
  const resetValue = () => {
    setValue({ title: "" });
  };
  useEffect(() => {
    reset && resetValue();
  }, [reset]);

  useEffect(() => {
    !loading &&
    document.activeElement.className.includes("dropdown-input") &&
    options.length === 0
      ? setArray([{ title: "no results found", disabled: true }])
      : setArray(options) && showDropdown();
  }, [options]);
  return (
    // <CRow className={`justify-content-center ${c}`} id={id}>
    //   <CCol xs="auto">
    //   </CCol>
    // </CRow>
    <div className="search-dropdown">
      {loading && (
        <CSpinner
          color="secondary"
          size="sm"
          style={{ position: "absolute", right: '1rem', top: '.7rem' }}
        />
      ) 
      //  (
      //   <div style={{ marginTop: "1.4rem" }}></div>
      // )
      }
      <CFormInput
        className="dropdown-input"
        onClick={showDropdown}
        value={value.title}
        onChange={onChangeValue}
        placeholder={placeholder ?? "search for title"}
      />
      <CListGroup className={className}>
        {Children.toArray(
          array?.map((option) => (
            <CListGroupItem
              component="button"
              className="floating-dropdown-item"
              type="button"
              onClick={() => onSelectValue(option)}
              disabled={option.disabled}
            >
              {option.title}
            </CListGroupItem>
          ))
        )}
      </CListGroup>
    </div>
  );
};

export default SearchDropdown;
