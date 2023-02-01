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
  CTooltip,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import EditableCell from "src/components/EditableCell";
import CIcon from "@coreui/icons-react";
import { cilTrash} from "@coreui/icons";

import Table from "../../components/Table";
import {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler
} from "../../store/category";
import AddCategoryModal from '../../components/AddCategoryModal'
import DeleteModal from "src/components/DeleteModal";
export const Parent = ({
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler
}) => {
  const {
    parentCategories: { data, count },
  } = useSelector((state) => state.category);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  const [visible, setVisible] =  useState(false)
  const DeleteButton = ({id}) =>{
    return(
      <React.Fragment>
        <DeleteModal visible={visible} onClose={()=> setVisible(false)} onDelete={deleteParentCategoryHandler} id={id} params={params}/>
        <CTooltip content='Delete'>
        <CButton color="danger" onClick={()=> setVisible(true)}>
          <CIcon icon={cilTrash}/>
        </CButton>

        </CTooltip>
      </React.Fragment>
    )
  }


  const columns = [
    {
      header: "english title",
      field: "entitle",
      body: (e) => (
        <EditableCell data={e} field="entitle" action={updateParentCategory} />
      ),
    },
    {
      header: "arabic title",
      field: "artitle",
      body: (e) => (
        <EditableCell data={e} field="artitle" action={updateParentCategory} />
      ),
    },
    {
      header: "meta title",
      field: "metatitle",
      body: (e) => (
        <EditableCell
          data={e}
          field="metatitle"
          action={updateParentCategory}
        />
      ),
    },
    {
      header: "actions",
      body: DeleteButton 
    },
  ];
  
  return (
    <>
      
      <AddCategoryModal params={params} action={addParentCategoryHandler} />
      <Table
        data={data}
        count={count}
        changeData={getParentCategoriesHandler}
        cookieName="parent"
        columns={columns}
        params={params}
        checkbox={true}
        
        updateParams={setParams}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getParentCategoriesHandler, updateParentCategory,addParentCategoryHandler,deleteParentCategoryHandler };

export default connect(mapStateToProps, mapDispatchToProps)(Parent);
