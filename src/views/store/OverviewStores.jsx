import {
  CLink,
  CTooltip,
  CPopover,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilSearch, cilFilterX } from "@coreui/icons";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import FilterCard from "src/components/FilterCard";
import Table from "src/components/Table";
import { getStoresHandler,updateStoreStatusHandler,updateStoreHandler,updateStoreNameHandler } from "../../store/store";
import EditableCell from "src/components/EditableCell";

const OverviewStores = ({ getStoresHandler,updateStoreStatusHandler,updateStoreHandler ,updateStoreNameHandler}) => {
  const initialParams ={ limit: 10, offset: 0 }
  const { data, count } = useSelector((state) => state.stores.overview);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  useEffect(() => {
    Promise.all([getStoresHandler(params)]).then(() => setLoading(false));
  }, []);
  const TooltipText = (data) => {
    return (
      <React.Fragment>
        <CPopover content={data[data.field]} placement="top">
          <CButton color="secondary" size="sm">
            Show
          </CButton>
        </CPopover>
      </React.Fragment>
    );
  };
  const columns = [
    { header: "store name", field: "store_name",
    body: data =>  !data.name_is_changed ? <EditableCell data={data} field='store_name' action={updateStoreNameHandler}/> :<span>{data.store_name}</span>
  
  },
    { header: "city", field: "city" },
    { header: "email verified", field: "verified_email", body: e=> <EditableCell data={e} field='verified_email' type='dropdown' options={[{value:false, name: 'false'},{value: true, name: 'true'}]} action={updateStoreHandler}/> },
    { header: "mobile", field: "mobile" , body: data => <EditableCell data={data} field='mobile' action={updateStoreHandler}/> },
    { header: "status", field: "status", body: e=> <EditableCell data={e} field='status' type='dropdown' options={[{value:'approved', name: 'approved'},{value: 'rejected', name: 'rejected'},{value: 'pending', name: 'pending'}]} action={e=> updateStoreStatusHandler(e,'overview')}/>  },
    { header: "verification code", field: "verification_code" },
    { header: "performance rating%", field: "performance_rate" },
    { header: "sales rating", field: "sales_rate" },
    {
      header: "caption",
      field: "caption",
      body: (data) => <TooltipText {...data} field="caption" />,
    },
    {
      header: "about",
      field: "about",
      body: (data) => <TooltipText {...data} field="about" />,
    },
  ];
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true)
    let data = {...initialParams}
    let params = ['performance_rate', 'sales_rate', 'query', 'status','verified_email']
    params.forEach(param =>{
      if(e.target[param]?.value&& e.target[param]?.value !== ''){
        data[param] = e.target[param].value
      }
    })
    getStoresHandler(data).then(()=> setLoading(false))

  };
  const resetTable = (e) => {
    e.target.reset();
    setParams(initialParams);
  };
  return (
    <>
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetTable}>
          <CRow className="justify-content-center" xs={{ gutterY: 3 }}>
            <CCol xs={12}>
              <CFormInput
                placeholder="search by store name, mobile number or store email"
                id="query"
              />
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="performance" >
                Performance Rating
              </CFormLabel>
              <CFormSelect name="performance" id="performance_rate">
              <option value="">All</option>
                <option value="90-100">90-100</option>
                <option value="80-90">80-90</option>
                <option value="70-80">70-80</option>
                <option value="60-70">60-70</option>
                <option value="50-60">50-60</option>
                <option value="0-50">less than 50</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="sales">Sales Rating</CFormLabel>
              <CFormSelect name="sales" id="sales_rate">
                <option value="">All</option>
                <option value="4-5">4-5</option>
                <option value="3-4">3-4</option>
                <option value="2-3">2-3</option>
                <option value="1-2">1-2</option>
                <option value="0-1">0-1</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect name="status" id="status">
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="email">Email Status</CFormLabel>
              <CFormSelect name="email" id="verified_email">
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12}></CCol>
          </CRow>
          <CRow className="justify-content-center">
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
      </FilterCard>
      <Table
        data={data}
        count={count}
        loading={loading}
        columns={columns}
        params={params}
        changeData={getStoresHandler}
        updateParams={setParams}
        cookieName='stores'
      />
    </>
  );
};

const mapDispatchToProps = { getStoresHandler,updateStoreStatusHandler,updateStoreHandler,updateStoreNameHandler };

export default connect(null, mapDispatchToProps)(OverviewStores);
