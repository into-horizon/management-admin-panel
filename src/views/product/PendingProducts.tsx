import CIcon from "@coreui/icons-react";
import {
  CButton,
  CPopover,
  CRow,
  CCol,
  CImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CTooltip,
  CForm,
  CFormInput,
  CModalFooter,
  CFormTextarea,
} from "@coreui/react";
import React, { useState, useEffect, Children, FormEvent } from "react";
import { connect, useSelector } from "react-redux";
import Table from "src/components/Table";
import { getPendingProducts, updateProductStatus } from "../../store/product";
import {
  cilImage,
  cilLibrary,
  cilDescription,
  cilCheck,
  cilX,
} from "@coreui/icons";
import { RootState } from "src/store";
import { ParamsType, ProductType } from "src/types";
import { events } from "src/App";

type PropTypes = {
  getPendingProducts: (p: ParamsType) => Promise<void>;
  updateProductStatus: (p: ProductType) => Promise<void>;
};

const PendingProducts = ({
  getPendingProducts,
  updateProductStatus,
}: PropTypes) => {
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<ParamsType>({ limit: 10, offset: 0 });
  const { data, count } = useSelector(
    (state: RootState) => state.products.pending
  );
  useEffect(() => {
    getPendingProducts(params).then(() => setLoading(false));
  }, []);
  events.on("pending", () => {
    console.log("🚀 ~ file: PendingProducts.tsx:50 ~ events.on ~ pending:");
  });
  const Details = (data: ProductType) => {
    const [visible, setVisible] = useState(false);
    return (
      <React.Fragment>
        <CPopover
          content={
            <>
              {data.parent_category_id && (
                <p>
                  <strong>parent category</strong>{" "}
                  <span>{`${data.p_entitle} - ${data.p_artitle}`}</span>
                </p>
              )}
              {data.child_category_id && (
                <p>
                  <strong>child category</strong>{" "}
                  <span>{`${data.c_entitle} - ${data.c_artitle}`}</span>
                </p>
              )}
              {data.grandchild_category_id && (
                <p>
                  <strong>grandchild category</strong>{" "}
                  <span>{`${data.g_entitle} - ${data.g_artitle}`}</span>
                </p>
              )}
            </>
          }
          placement="top"
        >
          <CButton color="link">
            <CTooltip content="categories">
              <CIcon icon={cilLibrary} />
            </CTooltip>
          </CButton>
        </CPopover>
        <CTooltip content="images">
          <CButton onClick={() => setVisible(true)} color="link">
            <CIcon icon={cilImage} />
          </CButton>
        </CTooltip>
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          alignment="center"
        >
          <CModalHeader>
            <CModalTitle>Product Images</CModalTitle>
          </CModalHeader>
          <CRow className="justify-content-center align-items-center">
            {Children.toArray(
              data.pictures.map(({ product_picture }) => (
                <CCol xs={4}>
                  <CImage
                    rounded
                    thumbnail
                    src={product_picture}
                    width={600}
                    height={600}
                  />
                </CCol>
              ))
            )}
          </CRow>
        </CModal>
        <CPopover
          content={
            <>
              <p>
                <strong>English description</strong>: {data.endescription}
              </p>
              <p>
                <strong>Arabic description</strong>: {data.ardescription}
              </p>
            </>
          }
        >
          <CButton color="link">
            <CTooltip content="description">
              <CIcon icon={cilDescription} />
            </CTooltip>
          </CButton>
        </CPopover>
      </React.Fragment>
    );
  };

  const StatusBody = (data: ProductType) => {
    const [visible, setVisible] = useState(false);
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const target = e.target as typeof e.target & {
        rejection_reason: HTMLSelectElement;
      };
      updateProductStatus({
        ...data,
        status: "rejected",
        rejection_reason: target.rejection_reason.value,
      });
    };
    return (
      <React.Fragment>
        <CModal
          visible={visible}
          alignment="center"
          onClose={() => setVisible(false)}
        >
          <CModalHeader>
            <CModalTitle>Product Rejection</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={submitHandler}>
            <CRow className="justify-content-center align-items-center">
              <CCol xs={10}>
                <CFormTextarea
                  label="Rejection Reason"
                  id="rejection_reason"
                  required
                />
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="danger" type="submit">
                Reject
              </CButton>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
        {data.status === "pending" ? (
          <CRow>
            <CCol xs="auto">
              <CTooltip content="Approve">
                <CButton
                  color="success"
                  onClick={() =>
                    updateProductStatus({ ...data, status: "approved" })
                  }
                >
                  <CIcon icon={cilCheck} />
                </CButton>
              </CTooltip>
            </CCol>
            <CCol xs="auto">
              <CTooltip content="Reject">
                <CButton color="danger" onClick={() => setVisible(true)}>
                  <CIcon icon={cilX} />
                </CButton>
              </CTooltip>
            </CCol>
          </CRow>
        ) : (
          <span>{data.status}</span>
        )}
      </React.Fragment>
    );
  };
  const columns = [
    { header: "arabic title", field: "artitle" },
    { header: "english title", field: "entitle" },
    { header: "store name", field: "store_name" },
    { header: "Details", body: Details },
    { header: "status", field: "status", body: StatusBody },
  ];
  return (
    <>
      <Table
        data={data}
        count={count}
        params={params}
        updateParams={setParams}
        loading={loading}
        columns={columns}
        updateLoading={setLoading}
        changeData={getPendingProducts}
        cookieName={"pending"}
      />
    </>
  );
};

const mapDispatchToProps = { getPendingProducts, updateProductStatus };

export default connect(null, mapDispatchToProps)(PendingProducts);
