import React, { useState, useEffect, Children } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CFormTextarea,
  CTooltip,
} from "@coreui/react";
import Category from "src/services/CategoryService";
import SelectSearch from "react-select-search";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import SearchDropdown from "./SearchDropdown";
import { getParentCategoriesHandler, getChildCategoriesHandler } from "src/store/category";
import { connect,useSelector } from "react-redux";
const AddCategoryModal = ({ action, type, params,getParentCategoriesHandler, getChildCategoriesHandler  }) => {
  const {parentCategories:{data:parentCategories}, childCategories:{data:childCategories},grandChildCategories:{data:grandChildCategories}} = useSelector(state=>state.category)
  const [visible, setVisible] = useState(false);
  const [parentData, setParentData] = useState([parentCategories]);
  const [parentId, setParentId] = useState("");
  const [childData, setChildData] = useState([]);
  const [childId, setChildId] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    getParentCategoriesHandler()
  }, []);
useEffect(()=>  setParentData(parentCategories), [parentCategories])
  const onChange = e =>{
   setChildData(childCategories.filter(x => x.entitle.toLowerCase().includes(e.toLowerCase())|| x.artitle.toLowerCase().includes(e.toLowerCase())))
  }
  useEffect(()=>{
    if(!!parentId){
      setLoading(true)
      getChildCategoriesHandler({ parent_id: parentId}).then(()=> {
        
        setLoading(false)
      }) 
    }
  },[parentId])
  useEffect(()=>{
    setChildData(childCategories)
  },[childCategories])

  const onChangeParent = e =>{
    setParentData(parentCategories.filter(x => x.entitle.includes(e)|| x.artitle.includes(e)))
  }
  const submitHandler = (e) => {
    e.preventDefault();
    action(
      {
        entitle: e.target.entitle.value,
        artitle: e.target.artitle.value,
        metatitle: e.target.metatitle.value,
        content: e.target.content.value,
        parent_id: type === "child" ? parentId : childId,
      },
      params
    );
    setVisible(false);
  };
  return (
    <React.Fragment>
      <CButton color="primary" onClick={() => setVisible(true)}>
        <CIcon icon={cilPlus} size="lg" />
        Add Category
      </CButton>

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        fullscreen="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Add Category</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow className="justify-content-center" xs={{ gutter: 2 }}>
            <CCol xs="auto">
              <CFormInput placeholder="english title" id="entitle" required />
            </CCol>
            <CCol xs="auto">
              <CFormInput placeholder="arabic title" id="artitle" required />
            </CCol>
            {(type === "child" || type === "grandchild") && (
             <CCol xs='auto'>
              <SearchDropdown options={parentData.map((val) => {
                      return {
                        title: `${val.entitle} - ${val.artitle}`,
                        id: val.id,
                      };
                    })}
                    
                    onChange={onChangeParent}
                    placeholder="select parent category"
                    onSelect={e=> setParentId(e.id)}
                    />
            </CCol>
            )}
            {type === "grandchild" && (
              <CCol xs='auto'>
              <SearchDropdown options={childData.map((val) => {
                      return {
                        title: `${val.entitle} - ${val.artitle}`,
                        id: val.id,
                      };
                    })}
                    
                    onChange={onChange}
                    placeholder="select child category"
                    onSelect={e=> setChildId(e.id)}
                    loading={loading}
                    />
            </CCol>
            )}
            <CCol xs={10}>
              <CFormInput placeholder="meta title" id="metatitle" />
            </CCol>
            <CCol xs={10}>
              <CFormTextarea placeholder="content" id="content" />
            </CCol>
          </CRow>
          <CModalFooter>
            <CButton type="submit">Submit</CButton>
            <CButton color="danger" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  );
};



export default connect(null, {getParentCategoriesHandler, getChildCategoriesHandler })(AddCategoryModal);
