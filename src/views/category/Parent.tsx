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
import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";
import EditableCell from "src/components/EditableCell";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

import Table, { ColumnType } from "../../components/Table";
import {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler,
} from "../../store/category";
import AddCategoryModal from "./components/AddCategoryModal";
import DeleteModal from "src/components/DeleteModal";
import { RootState } from "src/store";
import { ParamsType, ParentCategoriesType } from "src/types";
import { InputType } from "src/enums";

type PropTypes = {
  getParentCategoriesHandler: (p: ParamsType & {}) => Promise<void>;
  updateParentCategory: (p: ParentCategoriesType) => Promise<void>;
  addParentCategoryHandler: (p: ParentCategoriesType) => Promise<void>;
  deleteParentCategoryHandler: (d: string) => Promise<void>;
};

const Parent = ({
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler,
}: PropTypes) => {
  const {
    parentCategories: { data, count },
  } = useSelector((state: RootState) => state.category);
  const [params, setParams] = useState<ParamsType & {}>({
    limit: 10,
    offset: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getParentCategoriesHandler(params);
    setLoading(false);
  }, []);
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false);
    const deleteHandler = async () => {
      await deleteParentCategoryHandler(id);
      await getParentCategoriesHandler(params);
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
      header: "meta title",
      field: "metatitle",
      body: (data: ParentCategoriesType) =>
        data.metatitle ? data.metatitle : "-",
      edit: {
        inputType: InputType.TEXT,
      },
    },
  ];
  const addHandler = async (e: ParentCategoriesType) => {
    await addParentCategoryHandler(e);
    await getParentCategoriesHandler(params);
  };
  const Actions = (data: ParentCategoriesType) => {
    return (
      <Fragment>
        <DeleteButton {...data} />
      </Fragment>
    );
  };
  return (
    <>
      <AddCategoryModal action={addHandler} type="parent" />
      <Table
        data={data}
        count={count}
        changeData={getParentCategoriesHandler}
        cookieName="parent"
        columns={columns}
        params={params}
        loading={loading}
        updateParams={setParams}
        updateLoading={setLoading}
        editable
        editFn={updateParentCategory}
        Actions={Actions}
      />
    </>
  );
};

const mapDispatchToProps = {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler,
};

export default connect(null, mapDispatchToProps)(Parent);
