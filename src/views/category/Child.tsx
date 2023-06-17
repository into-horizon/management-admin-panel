import React, { useState, useEffect, FormEvent } from "react";
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
import { cilTrash, cilSearch, cilFilterX } from "@coreui/icons";
import Category from "src/services/CategoryService";
import SearchDropdown from "src/components/SearchDropdown";
import FilterCard from "src/components/FilterCard";
import { RootState } from "src/store";


type PropTypes = {
  getChildCategoriesHandler : (p: ParamsType & {}) => Promise<void>,
  updateChildCategory : (p:ChildAndGrandCategoriesType) =>  Promise<void>,
  addChildCategoryHandler : (p:ChildAndGrandCategoriesType) =>  Promise<void>,
  deleteChildCategoryHandler : (id: string) =>  Promise<void>,
}
 const Child = ({
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
} :PropTypes) => {
  const {
    childCategories: { data, count }, parentCategories: { data: parentCategories, }
  } = useSelector((state : RootState) => state.category);
  const [params, setParams] = useState<ParamsType>({ limit: 10, offset: 0 });
  const [parentData, setParentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true)
  const [selectedValue, setSelectedValue] = useState<ParentCategoriesType| null>(null)

  useEffect(() => {
    Promise.all([getChildCategoriesHandler(params)]).then(() => setTableLoading(false))
  }, [])
  const DeleteButton = ({ id }) => {
    const [visible, setVisible] = useState(false);
    const deleteHandler =async () => {
        await deleteChildCategoryHandler(id)
        await getChildCategoriesHandler(params)
        setVisible(false)
    }
    return (
      <React.Fragment>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={deleteHandler}
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
      body: (e : ChildAndGrandCategoriesType) => (
        <EditableCell data={e} field="entitle" action={updateChildCategory} />
      ),
    },
    {
      header: "arabic title",
      field: "artitle",
      body: (e : ChildAndGrandCategoriesType) => (
        <EditableCell data={e} field="artitle" action={updateChildCategory} />
      ),
    },
    { header: "parent english title", field: "p_entitle" },
    { header: "parent arabic title", field: "p_artitle" },
    {
      header: "meta title",
      field: "metatitle",
      body: (e : ChildAndGrandCategoriesType) => (
        <EditableCell data={e} field="metatitle" action={updateChildCategory} />
      ),
    },
    { header: "actions", body: DeleteButton },
  ];
  const onSelect = (e : ParentCategoriesType) => {
    setSelectedValue(e)
  };
  const getParent = async (title : string) => {
    setLoading(true);
    let {
      data: { data },
    } = await Category.getAllParentCategoires({
      title: title,
    });
    setLoading(false);
    setParentData(data);
  };
  const onChange = (e : string) => {
    setTimeout(() => getParent(e), 1000);
  };


  const submitHandler = (e: FormEvent<HTMLFormElement>)  => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      title: {value: string}
      reset(): void
    }
    let data = {}
    selectedValue?.id && (data['parent_id'] = selectedValue.id)
    target.title.value && (data['title'] = target.title.value)
    getChildCategoriesHandler(data)
  }
  const resetFilter = (e : FormEvent<HTMLFormElement> ) => {
    const target = e.target as typeof e.target & {
      title: {value: string}
      reset(): void
    }
    setSelectedValue(null)
    target.reset()
    getChildCategoriesHandler(params)
  }
  useEffect(() => {
    setParentData(parentCategories)
  }, [])
  return (
    <>
      <AddCategoryModal
        action={addChildCategoryHandler}
        type="child"
       
      />
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetFilter}>
          <CRow className="justify-content-center align-items-end">
            <CCol xs='auto'>
              <CFormInput id="title" placeholder="title" />
            </CCol>
            <CCol xs='auto'>
              <SearchDropdown
                options={parentData.map((x : ChildAndGrandCategoriesType) => {
                  return { id: x.id, title: `${x.entitle} - ${x.artitle}` };
                })}
                onSelect={onSelect}
                loading={loading}
                onChange={onChange}
                placeholder="search for parent category"
                reset={!selectedValue?.id}
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
                <CButton color="secondary" type='reset'>
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
        loading={tableLoading}
        updateLoading={setTableLoading}
        updateParams={setParams}
      />
    </>
  );
};


const mapDispatchToProps = {
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
};

export default connect(null, mapDispatchToProps)(Child);
