import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import React, { useState, useEffect, FormEvent } from "react";
import { connect, useSelector } from "react-redux";
import EditableCell from "src/components/EditableCell";
import FilterCard from "src/components/FilterCard";
import FormButtons from "src/components/FormButtons";
import Table, { ColumnType } from "src/components/Table";
import {
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
} from "../../store/discountCode";
import CreateCodeModal from "./CreateCodeModal";
import { DiscountCodeType, GetFunctionType, ParamsType } from "src/types";
import { RootState } from "src/store";
import { InputType } from "src/enums";
import { DSAEncoding } from "crypto";

type PropTypes = {
  getDiscountCodesHandler: GetFunctionType;
  updateDiscountCodeHandler: (payload: DiscountCodeType) => Promise<void>;
};
const PromoCodes = ({
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
}: PropTypes) => {
  const initialState = { limit: 10, offset: 0 };
  const { data, count } = useSelector((state: RootState) => state.discountCode);
  const [params, setParams] = useState(initialState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDiscountCodesHandler(params).then(() => setLoading(false));
  }, []);

  const columns: ColumnType[] = [
    {
      header: "name",
      field: "discount_code",
    },
    {
      header: "counter",
      field: "counter",
    },
    {
      header: "max counter",
      field: "max_counter",
      edit: {
        inputType: InputType.NUMBER,
      },
    },
    {
      header: "discount",
      field: "discount",
    },
    {
      header: "max discount",
      field: "max_discount",
      edit: {
        inputType: InputType.NUMBER,
      },
    },
    {
      header: "max usage per user",
      field: "number_of_time",
      edit: {
        inputType: InputType.NUMBER,
      },
    },
    {
      header: "expiry data",
      field: "expiry_date",
      body: (data: DiscountCodeType) =>
        new Date(data.expiry_date).toLocaleDateString(),
      edit: {
        inputType: InputType.DATE,
      },
    },
    {
      header: "min order amount",
      field: "min_order_amount",
      edit: {
        inputType: InputType.NUMBER,
      },
    },
    {
      header: "active",
      field: "active",
      body: (data: DiscountCodeType) => data.active.toString(),
      edit: {
        inputType: InputType.DROPDOWN,
        options: [
          { value: "false", name: "deactivate" },
          { value: "true", name: "activate" },
        ],
      },
    },
  ];
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const params: string[] = ["discount_code", "expiry_date", "active"];
    type InputTypes = {
      discount_code: HTMLInputElement;
      expiry_date: HTMLInputElement;
      active: HTMLSelectElement;
    };
    const target = e.target as typeof e.target & InputTypes;
    let data: ParamsType = { ...initialState };
    params.forEach((param) => {
      if (
        target[param as keyof InputTypes].value &&
        target[param as keyof InputTypes].value !== ""
      ) {
        data[param] = target[param as keyof InputTypes].value;
      }
    });
    getDiscountCodesHandler(data).then(() => {
      setLoading(false);
    });
  };
  return (
    <>
      <CreateCodeModal callback={getDiscountCodesHandler} params={params} />
      <FilterCard>
        <CForm onSubmit={submitHandler}>
          <CRow
            className="justify-content-center align-items-end"
            xs={{ gutterY: 3 }}
          >
            <CCol xs="auto">
              <CFormInput placeholder="code name" id="discount_code" />
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="active">Active</CFormLabel>
              <CFormSelect name="active" id="active">
                <option value="">All</option>
                <option value={"true"}>true</option>
                <option value={"false"}>false</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="expiry_date">Expiry Date Before</CFormLabel>
              <CFormInput name="expiry_date" type="date" id="expiry_date" />
            </CCol>
            <CCol xs={12}>
              <FormButtons />
            </CCol>
          </CRow>
        </CForm>
      </FilterCard>
      <Table
        params={params}
        loading={loading}
        columns={columns}
        data={data}
        count={count}
        cookieName="codes"
        changeData={getDiscountCodesHandler}
        updateLoading={setLoading}
        editable
        editFn={updateDiscountCodeHandler}
      />
    </>
  );
};

const mapDispatchToProps = {
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
};

export default connect(null, mapDispatchToProps)(PromoCodes);
