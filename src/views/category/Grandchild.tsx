import React, {
  useState,
  useEffect,
  Children,
  FormEvent,
  ChangeEvent,
} from "react";
import { connect, useSelector } from "react-redux";
import Table, { ColumnType } from "../../components/Table";
import {
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
} from "src/store/category";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilSearch, cilFilterX } from "@coreui/icons";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CTooltip,
} from "@coreui/react";
import EditableCell from "src/components/EditableCell";
import AddCategoryModal from "src/views/category/components/AddCategoryModal";
import DeleteModal from "src/components/DeleteModal";
import Category from "src/services/CategoryService";
import SearchDropdown from "src/components/SearchDropdown";
import { RootState } from "src/store";
import { ParamsType, ChildAndGrandCategoriesType } from "src/types";
import { InputType } from "src/enums";

type PropTypes = {
  getGrandChildCategoriesHandler: (p: ParamsType) => Promise<void>;
  updateGrandChildCategory: (c: ChildAndGrandCategoriesType) => Promise<void>;
  addGrandchildCategoryHandler: (
    c: ChildAndGrandCategoriesType
  ) => Promise<void>;
  deleteGrandchildCategoryHandler: (id: string) => Promise<void>;
};
const Grandchild = ({
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
}: PropTypes) => {
  const {
    grandChildCategories: { data, count },
  } = useSelector((state: RootState) => state.category);
  const [params, setParams] = useState<ParamsType & {}>({
    limit: 10,
    offset: 0,
  });
  const [childData, setChildData] = useState<ChildAndGrandCategoriesType[]>([]);
  const [value, setValue] = useState<{ id?: string }>({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reset, setReset] = useState<boolean>(false);
  useEffect(() => {
    !value.id && setReset(true);
  }, [value.id]);
  useEffect(() => {
    getGrandChildCategoriesHandler(params).then(() => setLoading(false));
  }, []);
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false);
    const deleteHandler = async () => {
      await deleteGrandchildCategoryHandler(id);
      await getGrandChildCategoriesHandler(params);
      setVisible(false);
    };
    return (
      <React.Fragment>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={deleteHandler}
          id={undefined}
        />
        <CTooltip content="Delete">
          <CButton color="danger" onClick={() => setVisible(true)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CTooltip>
      </React.Fragment>
    );
  };
  const columns: ColumnType[] = [
    {
      header: "english title",
      field: "entitle",
      edit: {
        inputType: InputType.TEXT,
      },
    },
    {
      header: "arabic title",
      field: "artitle",
      edit: {
        inputType: InputType.TEXT,
      },
    },

    {
      header: "parent title",
      field: "p_artitle",
      body: (e: ChildAndGrandCategoriesType) =>
        `${e.p_entitle} - ${e.p_artitle}`,
    },

    {
      header: "meta title",
      field: "metatitle",
      body: (data:ChildAndGrandCategoriesType) => data.metatitle ? data.metatitle: '-',
      edit:{
        inputType :InputType.TEXT ,
      }
    },
    
  ];

  const getChild = async (title: string) => {
    let {
      data: { data },
    } = await Category.getAllChildCategoires({ title: title });
    setChildData(data);
    setSearchLoading(false);
  };
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & { title: { value: string } };
    let data: { title?: string; parent_id?: string } = {};
    target.title.value && (data.title = target.title.value);
    value.id && (data.parent_id = value.id);
    getGrandChildCategoriesHandler({ ...params, ...data });
  };

  const clearFilter = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & { reset: () => void };
    target.reset();
    getGrandChildCategoriesHandler(params);
    setValue({});
  };
  const onChange = (e: string) => {
    setSearchLoading(true);
    setTimeout(() => getChild(e), 1000);
  };
  const addCategoryHandler = async (c: ChildAndGrandCategoriesType) => {
    await addGrandchildCategoryHandler(c);
    await getGrandChildCategoriesHandler(params);
  };
  const Actions = (data: ChildAndGrandCategoriesType) => {
    return (
      <>
        <DeleteButton {...data} />
      </>
    );
  };
  return (
    <>
      <AddCategoryModal type="grand" action={addCategoryHandler} />
      <div className="card padding mrgn25">
        <CForm onSubmit={submitHandler} onReset={clearFilter}>
          <CRow
            className="justify-content-center align-items-end"
            xs={{ gutter: 1 }}
          >
            <CCol xs="auto">
              <CFormInput id="title" placeholder="title" />
            </CCol>
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
                  reset={reset}
                  resetCallback={setReset}
                  onSelect={(e) => setValue(e)}
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
                <CButton color="secondary" type="reset">
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
        loading={loading}
        updateLoading={setLoading}
        updateParams={setParams}
        Actions={Actions}
        editable
        editFn={updateGrandChildCategory}
      />
    </>
  );
};

const mapDispatchToProps = {
  getGrandChildCategoriesHandler,
  updateGrandChildCategory,
  addGrandchildCategoryHandler,
  deleteGrandchildCategoryHandler,
};

export default connect(null, mapDispatchToProps)(Grandchild);
