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
import { cilTrash } from "@coreui/icons";

import Table from "../../components/Table";
import {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler
} from "../../store/category";
import AddCategoryModal from './components/AddCategoryModal'
import DeleteModal from "src/components/DeleteModal";
import { RootState } from "src/store";
import { ParamsType, ParentCategoriesType } from "src/types";

type PropTypes = {
  getParentCategoriesHandler: (p: ParamsType & {}) => Promise<void>
  updateParentCategory: (p: ParentCategoriesType) => Promise<void>
  addParentCategoryHandler: (p: ParentCategoriesType) => Promise<void>
  deleteParentCategoryHandler: (d: string) => Promise<void>
}


const Parent = ({ getParentCategoriesHandler, updateParentCategory, addParentCategoryHandler, deleteParentCategoryHandler }: PropTypes) => {
  const {
    parentCategories: { data, count },
  } = useSelector((state: RootState) => state.category);
  const [params, setParams] = useState<ParamsType & {}>({ limit: 10, offset: 0 });
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getParentCategoriesHandler(params)
    setLoading(false)
  }, [])
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false)
    const deleteHandler = async () => {
      await deleteParentCategoryHandler(id)
      await getParentCategoriesHandler(params)
      setVisible(false)
    }
    return (
      <React.Fragment>
        <DeleteModal visible={visible} onClose={() => setVisible(false)} onDelete={deleteHandler} id={undefined} />
        <CTooltip content='Delete'>
          <CButton color="danger" onClick={() => setVisible(true)}>
            <CIcon icon={cilTrash} />
          </CButton>

        </CTooltip>
      </React.Fragment>
    )
  }


  const columns = [
    {
      header: "english title",
      field: "entitle",
      body: (e: ParentCategoriesType) => (
        <EditableCell data={e} field="entitle" action={updateParentCategory} />
      ),
    },
    {
      header: "arabic title",
      field: "artitle",
      body: (e: ParentCategoriesType) => (
        <EditableCell data={e} field="artitle" action={updateParentCategory} />
      ),
    },
    {
      header: "meta title",
      field: "metatitle",
      body: (e: ParentCategoriesType) => (
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
  const addHandler = async (e: ParentCategoriesType) => {
    await addParentCategoryHandler(e)
    await getParentCategoriesHandler(params)

  }
  return (
    <>

      <AddCategoryModal action={addHandler} type='parent' />
      <Table
        data={data}
        count={count}
        changeData={getParentCategoriesHandler}
        cookieName="parent"
        columns={columns}
        params={params}
        checkbox
        loading={loading}
        updateParams={setParams}
        updateLoading={setLoading}
      />
    </>
  );
};


const mapDispatchToProps = { getParentCategoriesHandler, updateParentCategory, addParentCategoryHandler, deleteParentCategoryHandler };

export default connect(null, mapDispatchToProps)(Parent);
