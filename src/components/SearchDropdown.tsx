import React, { useState, useEffect, Children, ChangeEvent, Fragment, Dispatch, SetStateAction } from "react";
import {
  CCol,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from "@coreui/react";


type PropTypes = {
  options: { title: string, id: string }[],
  onSelect: (d: any) => void,
  onChange: (d: string) => void,
  loading: boolean,
  placeholder?: string,
 
} & ( { reset: boolean,
  resetCallback : Dispatch<React.SetStateAction<boolean>>} | {reset?: undefined})
const SearchDropdown = (props: PropTypes) => {
  const {
    options,
    onSelect,
    onChange,
    loading,
    placeholder,
    reset,
  } = props
  const [className, setClassName] = useState("floating-dropdown-hide");
  const [value, setValue] = useState({ title: "" });
  const showDropdown = () => {
    setClassName("floating-dropdown-show");
  };



  const onSelectValue = (e: typeof options[0]) => {
    setValue(e);
    setClassName("floating-dropdown-hide");
    onSelect(e);
  };
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ title: e.target.value });
    onChange?.(e.target.value);
  };

  document.addEventListener("click", () => {
    className === "floating-dropdown-show" &&
      !document.activeElement?.className.includes("dropdown-input") &&
      setClassName("floating-dropdown-hide");
  });
  const resetValue = () => {
    setValue({ title: "" });
  };
  useEffect(() => {
   if( reset) {resetValue() ; props.resetCallback?.(false);}
  }, [reset]);

 
  return (
   
    <Fragment>

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
            options.length !== 0 ? options?.map((option) => (
              <CListGroupItem
                component="button"
                className="floating-dropdown-item"
                type="button"
                onClick={() => onSelectValue(option)}
              >
                {option.title}
              </CListGroupItem>
            )) :
              value.title &&
              <CListGroupItem
                component="button"
                className="floating-dropdown-item"
                type="button"
                disabled
              >
                no results found
              </CListGroupItem>
          )}
        </CListGroup>
      </div>
    </Fragment>
  );
};

export default SearchDropdown;
