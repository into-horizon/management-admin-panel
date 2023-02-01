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

const AddCategoryModal = ({ action, type, params }) => {
  const [visible, setVisible] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [parentId, setParentId] = useState("");
  const [childData, setChildData] = useState([]);
  const [childId, setChildId] = useState("");
  useEffect(async () => {
    const getParent = async () => {
      let {
        data: { data },
      } = await Category.getAllParentCategoires();
      return data;
    };
    setParentData(await getParent());
  }, []);

  useEffect(async () => {
    if (parentId) {
      let {
        data: { data },
      } = await Category.getAllChildCategoires({ parent_id: parentId });
      setChildData(data);
    }
  }, [parentId]);
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
              <CCol xs={10}>
                {Children.toArray(
                  <SelectSearch
                    options={parentData.map((val) => {
                      return {
                        name: `${val.entitle} - ${val.artitle}`,
                        value: val.id,
                      };
                    })}
                    search={true}
                    placeholder="select parent category"
                    onChange={setParentId}
                    value={parentId}
                  />
                )}
              </CCol>
            )}
            {type === "grandchild" && (
              <CCol xs={10}>
                {Children.toArray(
                  <SelectSearch
                    options={childData.map((val) => {
                      return {
                        name: `${val.entitle} - ${val.artitle}`,
                        value: val.id,
                      };
                    })}
                    search={true}
                    placeholder="select child category"
                    value={childId}
                    onChange={setChildId}
                  />
                )}
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

export default AddCategoryModal;
