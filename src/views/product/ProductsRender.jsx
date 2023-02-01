import React, { useState, useEffect, Fragment } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import {
  CPaginationItem,
  CPagination,
  CButton,
  CSpinner,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CForm,
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
import Multiselect from "multiselect-react-dropdown";
import { useNavigate } from "react-router-dom";
import { updateSizeAndQuantity, updateDiscount } from "../../store/product";
import {
  AnimationType,
  DialogType,
  OutAnimationType,
  usePopup,
} from "react-custom-popup";
import Export from "../../components/Export";
import ColorSelector from "../../components/ColorSelector";
import colors from "../../services/colors";
import CIcon from "@coreui/icons-react";
import {
  cilPlus,
  cilPencil,
  cilStorage,
  cilTrash,
  cilCash,
  cilImagePlus,
} from "@coreui/icons";
import Paginator from "../../components/Paginator";
import DiscountModal from "./DiscountModal";
import SizeAndColorModal from "./SizeAndColorModal";
import DeleteProductModal from "./DeleteProductModal";

const ProductsRender = (props) => {
  const { showAlert, showOptionDialog, showInputDialog, showToast } =
    usePopup();

  const { updateSizeAndQuantity, updateDiscount, deleteProductHandler } = props;
  let sizeSymbols = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  let sizeNumbers = [];
  if (sizeNumbers.length === 0) {
    for (let i = 30; i <= 50; i++) {
      sizeNumbers.push(i);
    }
  }
  const navigate = useNavigate();
  const {
    message,
    overview: { count, data: products },
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const initialState = {
    discount: { visible: "", discount: false, discountRate: 0 },
    sizes: { original: [], updated: [] },
  };
  const selectedPage = Number(cookie.load(props.status)) || 1;
  const [params, setParams] = useState({
    status: props.status,
    limit: 5,
    offset: 5 * (selectedPage - 1),
  });
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState(initialState.sizes);
  const [sizesType, setSizesType] = useState({
    add: false,
    data: [...sizeSymbols],
  });
  const [values, setValues] = useState([]);
  const [SQLoad, setSQLoad] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState({
    SQBtn: false,
    discountBtn: false,
  });
  const [discountForm, setDiscountForm] = useState({
    ...initialState.discount,
  });
  const [sizeForm, setSizeForm] = useState({ visible: "" });
  const [product, setProduct] = useState({ color: false, size: false });
  const [colorAndSize, setColorAndSize] = useState({ color: "", size: "" });
  const { size: productSize, color: productColor } = product;
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

  const updateSQ = (id, s) => {
    setSizeForm((x) => {
      return { ...x, visible: id };
    });
    if (s) {
      setSizes({ ...sizes, original: JSON.parse(s), updated: JSON.parse(s) });
      JSON.parse(s)
        .map((val) => val.color)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, color: true };
        });
      JSON.parse(s)
        .map((val) => val.size)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, size: true };
        });
    }
  };

  const selectColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.updated.length + i + 1,
            size: null,
            color: val.name,
            quantity: 0,
          };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };
  const removeColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.original.length + i,
            size: null,
            color: val.name,
            quantity: 0,
          };
        }),
      ],
    };
    setSizes(x);
  };

  const select = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };
  const remove = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 };
        }),
      ],
    };
    setSizes(x);
  };
  const updateQuantity = (e) => {
    let x = sizes.updated.map((val) => {
      if (val.id === Number(e.target.id)) {
        return {
          ...val,
          quantity:
            Number(e.target.value) === 0 ? null : Number(e.target.value),
        };
      } else {
        return val;
      }
    });
    setSizes({ ...sizes, updated: x });
  };
  const addSizes = (e) => {
    setValues(() => [...e.target.value.split(",")]);
  };

  const removeSize = (size) => {
    let newSizes = sizes.updated.filter((val) => val.id !== size);
    let newOriginal = sizes.original.filter((val) => val.id !== size);
    setSizes({ ...sizes, original: newOriginal, updated: newSizes });
  };

  const updateSQHandler = (e, id) => {
    setSQLoad(true);
    e.preventDefault();
    updateSizeAndQuantity({
      id: id,
      quantity:
        sizes.updated.reduce((p, c) => p + Number(c.quantity), 0) ||
        e.target.quantityInput.value,
      size_and_color:
        sizes.updated.length > 0 ? JSON.stringify(sizes.updated) : null,
    });
    closeQuantityModal();
  };

  const deleteHandler = (id) => {
    showOptionDialog({
      containerStyle: { width: 350 },
      text: t("deleteText"),
      title: t("deleteTitle"),
      options: [
        {
          name: t("cancel"),
          type: "cancel",
        },
        {
          name: t("delete"),
          type: "confirm",
          style: { background: "lightcoral" },
        },
      ],
      onConfirm: () => {
        deleteProductHandler(id);
        showToast({
          type: DialogType.SUCCESS,
          text: t("successDelete"),
          timeoutDuration: 3000,
          showProgress: true,
        });
      },
    });
  };

  const addOwnSizes = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        ...values.map((val) => {
          return { size: val, quantity: 0 };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
    document.getElementById("sizesInput").value = null;
  };

  useEffect(() => {
    reverseTitles();
    changeBtnAlign();
  }, [i18n.language]);

  useEffect(() => {
    changeBtnAlign();
    reverseTitles();
  }, [document.querySelectorAll(".deleteBtn")]);

  const downloadableData = (data) => {
    return data?.map((product) => {
      let p = { ...product };
      delete p.pictures;
      delete p.size_and_color;
      return p;
    });
  };
  const closeQuantityModal = () => {
    setSizeForm({ visible: "" });
    setSizes(initialState.sizes);
    setProduct({ color: false, size: false });
  };

  const addSizeAndColor = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        {
          id: sizes.updated.length + 1,
          color: colorAndSize.color,
          size: colorAndSize.size,
          quantity: 0,
        },
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };

  const AddOwnComponent = ({ onClick }) => {
    return (
      <React.Fragment>
        {sizesType.add && (
          <div className="addOwnSizes">
            <CFormLabel htmlFor="validationServer05">{t("sizes")}</CFormLabel>
            <CFormInput
              type="text"
              value={values.join(",")}
              id="sizesInput"
              placeholder={t("inserSizes")}
              required
              onChange={addSizes}
            />
            <CButton color="secondary" type="button" onClick={onClick}>
              {t("add")}
            </CButton>
          </div>
        )}
      </React.Fragment>
    );
  };

  const addNewSizes = () => {
    setSizesType((d) => {
      return { ...d, data: [...d.data, ...values] };
    });
    setValues([]);
  };
  return (
    <>
      <div className="productsRender">
        <Export
          data={downloadableData(products ?? [])}
          title="download products"
          fileName="products"
        />
        {loading && <CSpinner />}
        {!loading && products.length === 0 && (
          <h4 className="productStatusHead">{t(`no${props.status}`)}</h4>
        )}
        {!loading &&
          products?.map((product, idx) => (
            <div className="productRender" key={product.entitle + idx}>
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
                    <DeleteProductModal deleteHandler={deleteProductHandler} product={product}/>
                  </CCol>
                  
                  <CCol xs="auto">
                    <SizeAndColorModal product={product} updateSizeAndQuantity={updateSizeAndQuantity}/>
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
            </div>
          ))}
        <Paginator
          count={count}
          params={params}
          updateParams={setParams}
          changeData={props.getProductsByStatus}
          cookieName={props.status}
        />
      </div>
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
