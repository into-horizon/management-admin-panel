import React, { useState, useEffect, Fragment, Children } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import {
  CButton,
  CSpinner,
  CFormLabel,
  CRow,
  CCol,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect,
} from "@coreui/react";
import {
  getProductsByStatus,
  addProductPictureHandler,
  deleteProductPictureHandler,
  deleteProductHandler,
} from "src/store/product";
import { useTranslation } from "react-i18next";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import { updateSizeAndQuantity, updateDiscount } from "../../store/product";
import Export from "../../components/Export";

import CIcon from "@coreui/icons-react";
import {
  cilPlus,
  cilPencil,
  cilStorage,
  cilTrash,
  cilCash,
  cilImagePlus,
  cilWarning,
} from "@coreui/icons";
import Paginator from "../../components/Paginator";
import DiscountModal from "./DiscountModal";
import SizeAndColorModal from "./SizeAndColorModal";
import DeleteProductModal from "./DeleteProductModal";
import StatusModal from "./StatusModal";
import Product from "src/services/ProductService";
import FilterCard from "src/components/FilterCard";
import FormButtons from "src/components/FormButtons";
import FormBody from "./FormBody";
const ProductsRender = (props) => {
  const { updateSizeAndQuantity, updateDiscount, deleteProductHandler } = props;
  // let sizeSymbols = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  // let sizeNumbers = [];
  // if (sizeNumbers.length === 0) {
  //   for (let i = 30; i <= 50; i++) {
  //     sizeNumbers.push(i);
  //   }
  // }
  
  const navigate = useNavigate();
  const {
    overview: { count, data: products },
  } = useSelector((state) => state.products);

  
  const [params, setParams] = useState({
    status: props.status,
    limit: 5,
    offset: 0,
  });
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    props.getProductsByStatus(params).then(() => setLoading(false));
  }, []);

  const completeArray = (x) => {
    let arr = [];
    for (let i = 0; i < 5 - x; i++) {
      arr.push({ id: "i" + 1, product_picture: null });
    }
    return arr;
  };
  const addProductPicture = (e, id) => {
    let formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("id", id);
    props.addProductPictureHandler(formData);
  };
  const changeBtnAlign = () => {
    let deleteBtn = document.querySelectorAll(".deleteBtn");
    if (i18n.language === "ar" && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(" ").slice(0, 3).join(" ");
      deleteBtn.forEach((button) =>
        button.setAttribute("class", `${className} deleteBtnAr`)
      );
    } else if (i18n.language === "en" && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(" ").slice(0, 3).join(" ");
      deleteBtn.forEach((button) =>
        button.setAttribute("class", `${className} deleteBtnEn`)
      );
    }
  };
  const reverseTitles = () => {
    if (
      i18n.language === "ar" &&
      document.querySelectorAll(".productTitles").length > 0
    ) {
      let div = document.querySelectorAll(".productTitles");
      div.forEach((item) => (item.style.flexDirection = "row-reverse"));
    } else if (
      i18n.language === "en" &&
      document.querySelectorAll(".productTitles").length > 0
    ) {
      let div = document.querySelectorAll(".productTitles");
      div.forEach((item) => (item.style.flexDirection = ""));
    }
  };

  useEffect(() => {
    reverseTitles();
    changeBtnAlign();
  }, [i18n.language]);

  useEffect(() => {
    changeBtnAlign();
    reverseTitles();
  }, [document.querySelectorAll(".deleteBtn")]);

  const getProducts = async (params) => {
    let {
      data: { data },
    } = await Product.getProducts(params);
    return data;
  };
  const submitHandler = e =>{
    e.preventDefault()
    setLoading(true);
    let queries = ['key', 'parent_category_id', 'child_category_id', 'grandchild_category_id', 'discount']
    let data ={...params}
    queries.forEach(query =>{
      if(e.target[query].value && e.target[query].value !== ''){
        data[query] = e.target[query].value
      }
    })
    setParams(data)
    props.getProductsByStatus(data).then(()=> setLoading(false))

  }
  const onReset = e=>{
    e.target.reset()
    setParams({
      status: props.status,
      limit: 5,
      offset: 0,
    })
  }
  return (
    <>
      <CRow xs={{ gutterY: 10 }} className="justify-content-end">
        <CCol xs="auto">
          <Export
            data={getProducts}
            // onClick={Product.getProducts}
            params={{ status: props.status }}
            title="download products"
            fileName="products"
          />
        </CCol>
        <CCol xs={12}>
          <FilterCard>
            <CForm onSubmit={submitHandler} onReset={onReset}>
              <CRow
                className="justify-content-center align-items-center"
                xs={{ gutterY: 5 }}
              >
                <CCol xs="auto">
                  <CFormInput placeholder="product name" id="key"/>
                </CCol>
                <FormBody/>
                <CCol xs="auto">
                  <CFormLabel htmlFor="discount" >discount</CFormLabel>
                  <CFormSelect name="discount" id="discount">
                    <option value="">All</option>
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12}></CCol>
                <FormButtons />
              </CRow>
            </CForm>
          </FilterCard>
        </CCol>
        {loading && (
          <CCol xs={12}>
            <CSpinner />
          </CCol>
        )}
        {!loading && products.length === 0 && (
          <h4 className="productStatusHead">{t(`no${props.status}`)}</h4>
        )}
        {!loading &&
          products?.map((product, idx) => (
            <CRow
              className="productRender"
              xs={{ gutterY: 2 }}
              key={product.entitle + idx}
            >
              <div className="productTitles">
                <h3 className="productTitle">{`${t("englishTitle")}: ${
                  product.entitle
                }`}</h3>
                <h3 className="productTitle">{`${t("arabicTitle")}: ${
                  product.artitle
                }`}</h3>
              </div>
              <div className="productPictures">
                {React.Children.toArray(
                  product.pictures.length > 0 || props.status !== "pending" ? (
                    [
                      ...product.pictures,
                      ...completeArray(product.pictures.length),
                    ]?.map((picture, i) => (
                      <div key={picture.id + Math.random()}>
                        {picture.product_picture ? (
                          <>
                            <CButton
                              color="light"
                              className="deleteBtn"
                              onClick={() =>
                                props.deleteProductPictureHandler({
                                  picture_id: picture.id,
                                })
                              }
                              style={{
                                visibility:
                                  props.status === "pending"
                                    ? "hidden"
                                    : "visible",
                              }}
                            >
                              X
                            </CButton>
                            <img
                              key={`pic${picture.id}`}
                              src={picture.product_picture}
                              alt="vbdf"
                            />
                          </>
                        ) : (
                          <>
                            <input
                              type="file"
                              id={product.id}
                              hidden
                              onChange={(e) => addProductPicture(e, product.id)}
                              accept="image/png,image/jpeg"
                            />
                            <label
                              htmlFor={product.id}
                              className="uploadLabel"
                              style={{
                                visibility:
                                  props.status === "pending"
                                    ? "hidden"
                                    : "visible",
                              }}
                            >
                              <CIcon icon={cilImagePlus}></CIcon>
                              {t("choosePhoto")}
                            </label>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <h2>{t("noPictures")}</h2>
                  )
                )}
              </div>
              <CAlert
                color="danger"
                className="d-flex align-items-center"
                visible={!!product.rejection_reason}
                style={{ marginTop: "1rem" }}
              >
                <CIcon
                  icon={cilWarning}
                  className="flex-shrink-0 me-2"
                  width={24}
                  height={24}
                />
                <div>
                  <strong>Rejection reason: </strong>
                  {`${product.rejection_reason}`}
                </div>
              </CAlert>
              <div className="productTitles">
                <div>
                  <h4>{t("englishDescrition")}</h4>
                  <p style={{ textAlign: "left" }}>{product.endescription}</p>
                </div>
                <div>
                  <h4>{t("arabicDescription")}</h4>
                  <p style={{ textAlign: "right" }}>{product.ardescription}</p>
                </div>
              </div>
              {product.store_name && (
                <h5>
                  <strong>Store: </strong>
                  {product.store_name}
                </h5>
              )}
              {product.metatitle && (
                <h5>
                  <strong>{t("metatitle")}: </strong>
                  {product.metatitle}
                </h5>
              )}
              {product.sku &&
                ((i18n.language === "en" && (
                  <h5>
                    <strong>{t("SKU")}:</strong>
                    {product.sku}
                  </h5>
                )) ||
                  (i18n.language === "ar" && (
                    <h5>
                      {product.sku}
                      <strong> :{t("SKU")}</strong>
                    </h5>
                  )))}
              {!product.size ? (
                <h5>
                  <strong>{t("quantity")}: </strong>
                  {product.quantity}
                </h5>
              ) : null}
              <h6>
                <strong>{`${t("parentCategory")}: `}</strong>
                {product.p_entitle}
              </h6>
              <h6>
                <strong>{`${t("childCategory")}:`}</strong> {product.c_entitle}
              </h6>
              {product.grandchild_category_id && (
                <h6>
                  <strong>{`${t("grandChildCategory")}:`}</strong>{" "}
                  {product.g_entitle}
                </h6>
              )}
              <h6>
                <strong>{`${t("price")}:`}</strong>{" "}
                {product.price + " " + t(`${product.currency}`)}
              </h6>
              {product.brand_name ? (
                <h6>
                  <strong>{`${t("brandName")}: `}</strong>
                  {product.brand_name}
                </h6>
              ) : null}
              {product.rate ? (
                <h6>
                  <strong>{`Rate: `}</strong>
                  {Number(product.rate).toFixed(2)}
                </h6>
              ) : null}
              <h6>
                <strong>{t("hasDiscount")}: </strong>
                {product.discount ? t("yes") : t("no")}
              </h6>
              {product.discount ? (
                <h6>
                  <strong>{t("discountRate")}: </strong>
                  {product.discount_rate * 100}%
                </h6>
              ) : null}
              {product.size_and_color ? (
                <div>
                  <h6>
                    <strong>{t("sizes")}:</strong>
                  </h6>
                  <table className="sizesTable">
                    <thead>
                      <tr>
                        {JSON.parse(product.size_and_color)
                          .map((val) => val.color)
                          .filter((val) => val).length > 0 && <th>Color</th>}
                        {JSON.parse(product.size_and_color)
                          .map((val) => val.size)
                          .filter((val) => val).length > 0 && (
                          <th>{t("size")}</th>
                        )}
                        <th>{t("quantity")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {React.Children.toArray(
                        JSON.parse(product.size_and_color).map((val) => (
                          <tr key={Math.random()}>
                            {val.color && <td>{val.color}</td>}
                            {val.size && <td>{val.size}</td>}
                            <td>{val.quantity}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <thead>
                      <tr>
                        <th>{t("totalQuantity")}</th>
                        <th>{product.quantity}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              ) : null}
              {props.status !== "pending" && (
                <CRow className="justify-content-between">
                  <CCol xs="auto">
                    <DiscountModal
                      data={product}
                      updateDiscount={updateDiscount}
                    />
                  </CCol>
                  <CCol xs="auto">
                    {/* <CButton
                      color="danger"
                      onClick={() => deleteHandler(product.id)}
                    >
                      <CIcon icon={cilTrash}></CIcon>
                      {t("delete")}
                    </CButton> */}
                    <DeleteProductModal
                      deleteHandler={deleteProductHandler}
                      product={product}
                    />
                  </CCol>

                  <CCol xs="auto">
                    <SizeAndColorModal
                      product={product}
                      updateSizeAndQuantity={updateSizeAndQuantity}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <StatusModal product={product} />
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      color="primary"
                      onClick={() => {
                        navigate(`/product/updateProduct?id=${product.id}`);
                      }}
                    >
                      <CIcon icon={cilPencil}></CIcon>
                      {t("editProduct")}
                    </CButton>
                  </CCol>
                </CRow>
              )}
            </CRow>
          ))}
        <Paginator
          count={count}
          params={params}
          updateParams={setParams}
          changeData={props.getProductsByStatus}
          cookieName={props.status}
        />
      </CRow>
    </>
  );
};
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getProductsByStatus,
  addProductPictureHandler,
  deleteProductPictureHandler,
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductsRender);
