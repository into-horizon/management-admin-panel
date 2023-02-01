import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
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
  cilPlus,
  cilPencil,
  cilStorage,
  cilTrash,
  cilCash,
  cilImagePlus,
} from "@coreui/icons";
import ColorSelector from "../../components/ColorSelector";
import colors from "../../services/colors";
import { useTranslation } from "react-i18next";
import Multiselect from "multiselect-react-dropdown";
import { useRef } from "react";
import { Children } from "react";

const SizeAndColorModal = ({ product, updateSizeAndQuantity }) => {
  const _sizeAndColor = JSON.parse(product.size_and_color);
  const productColor = !!_sizeAndColor?.[0]?.color;
  const productSize = !!_sizeAndColor?.[0]?.size;
  const productColors =
    _sizeAndColor
      ?.map((val) => val.color)
      .filter((val, i, a) => i === a.indexOf(val)) ?? [];
  const productSizes =
    _sizeAndColor
      ?.map((val) => val.size)
      .filter((val, i, a) => i === a.indexOf(val)) ?? [];
  const [sizeAndColor, setSizeAndColor] = useState(_sizeAndColor);
  const [values, setValues] = useState([]);
  const selectedColor = useRef();
  const selectedSize = useRef();
  const [visible, setVisible] = useState(false);
  let sizeSymbols = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  let sizeNumbers = [];
  if (sizeNumbers.length === 0) {
    for (let i = 30; i <= 50; i++) {
      sizeNumbers.push(i);
    }
  }
  const [sizesType, setSizesType] = useState({
    add: false,
    data: [...sizeSymbols],
  });
  const { t } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const addOwnSizes = () => {
    let x = [
      ...sizeAndColor,
      ...values.map((val) => {
        return { size: val, quantity: 0 };
      }),
    ];

    x = x.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
    setValues([])
  };
  const AddOwnComponent = ({ onClick, setValues }) => {
    const addSizes = (e) => {
      setValues([...e.target.value.split(",")]);
    };
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
  const closeQuantityModal = () => {
    setVisible(false);
    setSizeAndColor(_sizeAndColor)
  };
  const submitHandler = (e) => {
    e.preventDefault();
      updateSizeAndQuantity({
        id: product.id,
        quantity:
          sizeAndColor?.reduce((p, c) => p + Number(c.quantity), 0) ||
          e.target.quantityInput.value,
        size_and_color:
        sizeAndColor ? JSON.stringify(sizeAndColor) : null,
      });
      closeQuantityModal();
  
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
  const selectColors = (e) => {
    let x = [
      ..._sizeAndColor,
      ...e.map((val, i) => {
        return {
          id: _sizeAndColor.length + i,
          size: null,
          color: val.name,
          quantity: 1,
        };
      }),
    ];
    x = x.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizeAndColor(x);
  };
  const removeColors = (e) => {
    let x = [
      ..._sizeAndColor,
      ...e.map((val, i) => {
        return {
          id: _sizeAndColor.length + i,
          size: null,
          color: val.name,
          quantity: 1,
        };
      }),
    ];

    setSizeAndColor(x);
  };
  const addSizeAndColor = () => {
    let x = [
      ...sizeAndColor,
      {
        id: sizeAndColor.length + 1,
        color: selectedColor.current.value,
        size: selectedSize.current.value,
        quantity: 1,
      },
    ];

    x = x.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizeAndColor(x);
  };
  const addNewSizes = () => {
    setSizesType((d) => {
      return { ...d, data: [...d.data, ...values] };
    });
    setValues([]);
  };
  const addSizes = (e) => {
    setValues(() => [...e.target.value.split(",")]);
  };

  const updateQuantity = (e, item) => {
   

    let s = sizeAndColor.map((val) => {
      if (val.id === item.id) {
        return { ...val, quantity: e.target.value };
      } else return val
    });

    setSizeAndColor(s)
  };
  const removeSize = id =>{
   setSizeAndColor(x=> x.filter(val=> val.id !== id))
  }
  return (
    <div>
      <CButton
        color="success"
        className="SQBtn"
        onClick={() => setVisible(true)}
      >
        <CIcon icon={cilStorage}></CIcon>
        {t("quantity")}
      </CButton>
      <CModal
        alignment="center"
        size={product.size_and_color && "lg"}
        scrollable={true}
        visible={visible}
        onClose={closeQuantityModal}
      >
        <CModalHeader>
          <CModalTitle>{t("quantity")}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          {/* <fieldset className="fieldset">
                 <legend className='legend'>{t('quantity')}</legend>
             </fieldset> */}
          {!product.size_and_color && (
            <h6 style={{ margin: "2rem 0", textAlign: "center" }}>
              <strong>{t("quantity")}: </strong>
              <input
                className="discounRate"
                id="quantityInput"
                type="number"
                min="1"
                defaultValue={product.quantity}
              />
            </h6>
          )}
          <CRow>
            <CCol md={6}>
              {productColor && !productSize && (
                <div className="m-10rem">
                  {" "}
                  <Multiselect
                    options={colors
                      .filter((val) => !productColors.includes(val))
                      .map((val, idx) => {
                        return { name: val, id: idx + 1 };
                      })}
                    onSelect={selectColors}
                    onRemove={removeColors}
                    displayValue="name"
                    placeholder={t("select")}
                  />
                </div>
              )}
              {productSize && !productColor && (
                <div>
                  <div>
                    <section className="radioBtns">
                      <section>
                        <CFormCheck
                          type="radio"
                          name="s"
                          id="TC1"
                          label={t("symbolSizes")}
                          defaultChecked
                          onChange={() =>
                            setSizesType((x) => {
                              return {
                                ...x,
                                data: [...sizeSymbols],
                                add: false,
                              };
                            })
                          }
                        />
                      </section>

                      <section>
                        <CFormCheck
                          type="radio"
                          name="s"
                          id="TC2"
                          label={t("numericSizes")}
                          onChange={() =>
                            setSizesType({
                              ...sizesType,
                              data: [...sizeNumbers],
                              add: false,
                            })
                          }
                        />
                      </section>
                      <section>
                        <CFormCheck
                          type="radio"
                          name="s"
                          id="TC2"
                          label={t("addOther")}
                          onChange={() =>
                            setSizesType({
                              ...sizesType,
                              add: true,
                            })
                          }
                        />
                      </section>
                    </section>
                  </div>
                  <div className="m-10rem">
                    {!sizesType.add && (
                      <Multiselect
                        options={sizesType.data.map((val, idx) => {
                          return { name: val, id: idx + 1 };
                        })}
                        onSelect={select}
                        onRemove={remove}
                        selectedValues={(e) => console.log(e)}
                        displayValue="name"
                        placeholder={t("select")}
                      />
                    )}

                    {/* {sizesType.add && <div className="addOwnSizes" >
                                         <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel>
                                         <CFormInput type="text" id="sizesInput" placeholder={t('inserSizes')} required onChange={addSizes} />
                                         <CButton color="secondary" type="button" onClick={addOwnSizes} >
                                             {t('add')}
                                         </CButton>
                                     </div>} */}
                    {sizesType.add && (
                      <AddOwnComponent
                        setValues={setValues}
                        onClick={addOwnSizes}
                      />
                    )}
                  </div>
                </div>
              )}
              {productSize && productColor && (
                <CRow className="padding">
                  <CCol md={12}>
                    <CFormCheck
                      type="radio"
                      name="sc"
                      label={t("symbolSizes")}
                      defaultChecked
                      onChange={() =>
                        setSizesType({
                          ...sizesType,
                          data: [...sizeSymbols],
                          add: false,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormCheck
                      type="radio"
                      name="sc"
                      label={t("numericSizes")}
                      onChange={() =>
                        setSizesType({
                          ...sizesType,
                          data: [...sizeNumbers],
                          add: false,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormCheck
                      type="radio"
                      name="sc"
                      label={t("addOther")}
                      onChange={() => setSizesType({ ...sizesType, add: true })}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormSelect ref={selectedSize}>
                      <option value="" disabled>
                        select size
                      </option>
                      {sizesType.data.map((val, idx) => (
                        <option key={idx + val} value={val}>
                          {val}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <ColorSelector selectstatement="true" ref={selectedColor} />
                  </CCol>
                  <CCol md={4}>
                    <CButton
                      color="secondary"
                      onClick={addSizeAndColor}
                      // disabled={!(selectedColor.current?.value && selectedSize.current?.value)}
                    >
                      <CIcon icon={cilPlus} size="sm"></CIcon>
                      {t("add")}
                    </CButton>
                  </CCol>
                  {/* <AddOwnComponent onClick={addNewSizes} /> */}
                  {sizesType.add && (
                    <div className="addOwnSizes">
                      <CFormLabel htmlFor="validationServer05">
                        {t("sizes")}
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        value={values.join(",")}
                        id="sizesInput"
                        placeholder={t("inserSizes")}
                        onChange={addSizes}
                      />
                      <CButton
                        color="secondary"
                        type="button"
                        onClick={addNewSizes}
                      >
                        {t("add")}
                      </CButton>
                    </div>
                  )}
                </CRow>
              )}
            </CCol>
            {(productColor || productSize) && (
              <CCol md={6}>
                <ul className="productUl">
                  {sizeAndColor.length > 0 &&
                    Children.toArray(sizeAndColor.map((item) => (
                      <li className="m-5rem">
                        <button
                          type="button"
                          onClick={() => removeSize(item.id)}
                        >
                          X
                        </button>
                        {item.size && item.color && (
                          <>
                            <strong className="m-5rem">{item.size}</strong> -
                            <strong className="m-5rem">{item.color}</strong>
                          </>
                        )}
                        {item.size && !item.color && (
                          <strong className="m-5rem">{item.size}</strong>
                        )}
                        {!item.size && item.color && (
                          <strong className="m-5rem">{item.color}</strong>
                        )}
                        <input
                          min="0"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(e, item)}
                        />
                      </li>
                    )))}
                  {}{" "}
                </ul>
              </CCol>
            )}
          </CRow>
          <CModalFooter>
            <CButton color="primary" type="submit">
              {t("submit")}
            </CButton>

            <CButton color="danger" onClick={closeQuantityModal}>
              {t("cancel")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  );
};

export default SizeAndColorModal;
