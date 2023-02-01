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
  useEffect(async () => {
    let {
      data: { data },
    } = await Category.getAllChildCategoires({limit: 1000000, offset: 0});
    setChildData(data);
  }, []);
  const submitHandler = e => {
    e.preventDefault();
    getGrandChildCategoriesHandler(params)
  }
  const onChange = e => {
    let data = {}
    data[e.target.id] = e.target.value;
    setParams(x=> {return{...x,...data }})
  }
  const clearFilter = ()=>{
    getGrandChildCategoriesHandler()
  }
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
            className="justify-content-center align-items-center"
            xs={{ gutter: 1 }}
          >
            <CCol xs="auto">
              <CFormInput id="title" placeholder="title" onChange={onChange}/>
            </CCol>
            <CCol xs="auto">
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
                  onChange={e=> setParams(x=> {return {...x,parent_id : e}})}
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
