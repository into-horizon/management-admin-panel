import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import Table from "../../components/Table";
import EditableCell from "src/components/EditableCell";
import {
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
} from "src/store/category";
import AddCategoryModal from "src/components/AddCategoryModal";
import DeleteModal from "src/components/DeleteModal";
import { CButton, CCol, CForm, CFormInput, CRow, CTooltip } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilSearch,cilFilterX  } from "@coreui/icons";
import Category from "src/services/CategoryService";
import SearchDropdown from "src/components/SearchDropdown";
import FilterCard from "src/components/FilterCard";


export const Child = ({
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
}) => {
  const {
    childCategories: { data, count }, parentCategories : {data: parentCategories,}
  } = useSelector((state) => state.category);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  const [visible, setVisible] = useState(false);
  const [parentData, setParentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue,setSelectedValue] = useState({})

  const DeleteButton = ({ id }) => {
    return (
      <React.Fragment>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={deleteChildCategoryHandler}
          id={id}
          params={params}
        />
        <CTooltip content="Delete">
          <CButton color="danger" onClick={() => setVisible(true)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CTooltip>
      </React.Fragment>
    );
  };
  const columns = [
    {
      header: "english title",
      field: "entitle",
      body: (e) => (
        <EditableCell data={e} field="entitle" action={updateChildCategory} />
      ),
    },
    {
      header: "arabic title",
      field: "artitle",
      body: (e) => (
        <EditableCell data={e} field="artitle" action={updateChildCategory} />
      ),
    },
    { header: "parent english title", field: "p_entitle" },
    { header: "parent arabic title", field: "p_artitle" },
    {
      header: "meta title",
      field: "metatitle",
      body: (e) => (
        <EditableCell data={e} field="metatitle" action={updateChildCategory} />
      ),
    },
    { header: "actions", body: DeleteButton },
  ];
  const onSelect = (e) => {
    setSelectedValue(e)
  };
  const getParent = async (title) => {
    setLoading(true);
    let {
      data: { data },
    } = await Category.getAllParentCategoires({
      title: title,
      limit: 100000,
      offset: 0,
    });
    setLoading(false);
    setParentData(data);
  };
  const onChange = (e) => {
    setTimeout(() => getParent(e), 1000);
  };


  const submitHandler = e=>{
    e.preventDefault()
    
    let data= {}
    selectedValue.id && (data['parent_id'] = selectedValue.id)
    e.target.title.value && (data['title'] = e.target.title.value)
    getChildCategoriesHandler(data)
  }
  const resetFilter= ()=>{
    setSelectedValue({})
    document.getElementById('title').value = ''
    getChildCategoriesHandler()
  }
  useEffect(()=>{
    setParentData(parentCategories)
  },[])
  return (
    <>
      <AddCategoryModal
        action={addChildCategoryHandler}
        type="child"
        params={params}
      />
      <FilterCard>
      <CForm onSubmit={submitHandler}>
          <CRow className="justify-content-center align-items-end">
            <CCol xs='auto'>
              <CFormInput id="title" placeholder="title"/>
            </CCol>
            <CCol xs='auto'>
              <SearchDropdown
                options={parentData.map((x) => {
                  return { id: x.id, title: `${x.entitle} - ${x.artitle}` };
                })}
                onSelect={onSelect}
                loading={loading}
                onChange={onChange}
                placeholder="search for parent category"
                reset={!selectedValue.id}
              />
            </CCol>
            <CCol xs="auto">
              <CTooltip content="search">
                <CButton type="submit">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CTooltip>
            </CCol>
            <CCol xs="auto">
              <CTooltip content="clear filter">
                <CButton color="secondary"  onClick={resetFilter}>
                  <CIcon icon={cilFilterX} />
                </CButton>
              </CTooltip>
            </CCol>

          </CRow>
        </CForm>
      </FilterCard> 
      <Table
        data={data}
        count={count}
        changeData={getChildCategoriesHandler}
        cookieName="child"
        columns={columns}
        params={params}
        checkbox={true}
        updateParams={setParams}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Child);
