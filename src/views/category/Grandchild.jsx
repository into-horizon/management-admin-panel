import React, { useState, useEffect, Children } from "react";
import { connect, useSelector } from "react-redux";
import Table from "../../components/Table";
import {
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
} from "src/store/category";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilSearch,cilFilterX } from "@coreui/icons";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CTooltip,
} from "@coreui/react";
import EditableCell from "src/components/EditableCell";
import AddCategoryModal from "src/components/AddCategoryModal";
import DeleteModal from "src/components/DeleteModal";
import SelectSearch from "react-select-search";
import Category from "src/services/CategoryService";
import SearchDropdown from "src/components/SearchDropdown";


export const Grandchild = ({
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
}) => {
  const {
    grandChildCategories: { data, count },
  } = useSelector((state) => state.category);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  const [visible, setVisible] = useState(false);
  const [childData, setChildData] = useState([]);
  const [value, setValue] = useState({})
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] =  useState(false)
  useEffect(()=>{
    getGrandChildCategoriesHandler(params).then(()=> setLoading(false))
  },[])
  const DeleteButton = ({ id }) => {
    return (
      <React.Fragment>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={deleteGrandchildCategoryHandler}
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
        <EditableCell
          data={e}
          field="entitle"
          action={updateGrandChildCategory}
        />
      ),
    },
    {
      header: "arabic title",
      field: "artitle",
      body: (e) => (
        <EditableCell
          data={e}
          field="artitle"
          action={updateGrandChildCategory}
        />
      ),
    },
    { header: "parent english title", field: "p_entitle" },
    { header: "parent arabic title", field: "p_artitle" },
    {
      header: "meta title",
      field: "metatitle",
      body: (e) => (
        <EditableCell
          data={e}
          field="metatitle"
          action={updateGrandChildCategory}
        />
      ),
    },
    { header: "actions", body: DeleteButton },
  ];

  const getChild = async (title) =>{
    let {
          data: { data },
        } = await Category.getAllChildCategoires({title : title});
        setChildData(data);
        setSearchLoading(false)
  }
  const submitHandler = e => {
    e.preventDefault();
    let data = {}
    e.target.title.value&& (data.title=  e.target.title.value)
    value.id && (data.parent_id = value.id)
    getGrandChildCategoriesHandler({...params,...data})
  }

  const clearFilter = ()=>{
    getGrandChildCategoriesHandler()
    setValue({})
  }
  const onChange = (e) => {
    setSearchLoading(true)
    setTimeout(() => getChild(e), 1000);
  };
  return (
    <>
      <AddCategoryModal
        type="grandchild"
        action={addGrandchildCategoryHandler}
        params={params}
      />
      <div className="card padding mrgn25">
        <CForm onSubmit={submitHandler}>
          <CRow
            className="justify-content-center align-items-end"
            xs={{ gutter: 1 }}
          >
            <CCol xs="auto">
              <CFormInput id="title" placeholder="title"/>
            </CCol>
            {/* <CCol xs="auto">
              {Children.toArray(
                <SelectSearch
                  options={childData.map((val) => {
                    return {
                      name: `${val.entitle} - ${val.artitle}`,
                      value: val.id,
                    };
                  })}
                  id='parent_id'
                  search={true}
                  placeholder="select child category"
                  value={params.parent_id}
                  onChange={onChange}
                />
              )}
            </CCol> */}
            <CCol xs="auto">
              {Children.toArray(
                <SearchDropdown
                  options={childData.map((val) => {
                    return {
                      title: `${val.entitle} - ${val.artitle}`,
                      id: val.id,
                    };
                  })}
                  placeholder="select child category"
                  onChange={onChange}
                  reset={!value.id}
                  onSelect={e=> setValue(e)}
                  loading={searchLoading}
                />
              )}
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
                <CButton color="secondary"  onClick={clearFilter}>
                  <CIcon icon={cilFilterX} />
                </CButton>
              </CTooltip>
            </CCol>
          </CRow>
        </CForm>
      </div>
      <Table
        data={data}
        count={count}
        changeData={getGrandChildCategoriesHandler}
        cookieName="grandchild"
        columns={columns}
        params={params}
        checkbox={true}
        loading={loading}
        updateLoading={setLoading}
        updateParams={setParams}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Grandchild);
