import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import EditableCell from "src/components/EditableCell";
import FilterCard from "src/components/FilterCard";
import FormButtons from "src/components/FormButtons";
import Table from "src/components/Table";
import {
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
} from "../../store/discountCode";
import CreateCodeModal from "./CreateCodeModal";
export const PromoCodes = ({
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
}) => {
  const initialState = { limit: 10, offset: 0 };
  const { data, count } = useSelector((state) => state.discountCode);
  const [params, setParams] = useState(initialState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDiscountCodesHandler(params).then(() => setLoading(false));
  }, []);

  const columns = [
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
      body: (data) => (
        <EditableCell
          data={data}
          field="max_counter"
          action={updateDiscountCodeHandler}
        />
      ),
    },
    {
      header: "discount",
      field: "discount",
    },
    {
      header: "max discount",
      field: "max_discount",
      body: (data) => (
        <EditableCell
          data={data}
          field="max_discount"
          action={updateDiscountCodeHandler}
        />
      ),
    },
    {
      header: "max usage per user",
      field: "number_of_time",
      body: (data) => (
        <EditableCell
          data={data}
          field="number_of_time"
          action={updateDiscountCodeHandler}
        />
      ),
    },
    {
      header: "expiry data",
      field: "expiry_date",
      body: (data) => (
        <EditableCell
          data={data}
          field="expiry_date"
          type="date"
          action={updateDiscountCodeHandler}
        />
      ),
    },
    {
      header: "min order amount",
      field: "min_order_amount",
      body: (data) => (
        <EditableCell
          data={data}
          field="min_order_amount"
          action={updateDiscountCodeHandler}
        />
      ),
    },
    ,
    {
      header: "active",
      field: "active",
      body: (data) => (
        <EditableCell
          data={data}
          field="active"
          type="dropdown"
          options={[
            { value: false, name: "deactivate" },
            { value: true, name: "activate" },
          ]}
          action={updateDiscountCodeHandler}
        />
      ),
    },
  ];
  const submitHandler= e =>{
    e.preventDefault()
    setLoading(true);
    const params =['discount_code','expiry_date', 'active']
    let data ={...initialState}
    params.forEach(param =>{
      if(e.target[param].value && e.target[param].value !== '') {
        data[param] = e.target[param].value
      }
    })
    getDiscountCodesHandler(data).then(()=>{
      setLoading(false)
    })
  }
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
              <CFormInput placeholder="code name" id="discount_code"/>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="active">Active</CFormLabel>
              <CFormSelect name="active" id="active">
                <option value="">All</option>
                <option value={true}>true</option>
                <option value={false}>false</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="expiry_date">Expiry Date Before</CFormLabel>
              <CFormInput name="expiry_date" type="date" id="expiry_date"/>
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
      />
    </>
  );
};

const mapDispatchToProps = {
  getDiscountCodesHandler,
  updateDiscountCodeHandler,
};

export default connect(null, mapDispatchToProps)(PromoCodes);
