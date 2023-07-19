import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
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
  CModalBody,
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
import _ from "lodash";
import { ProductType, QuantityDetailsType } from "src/types";

type PropTypes = {
  product: ProductType
  updateSizeAndQuantity: (p: { id: string, quantity: number, size_and_color: string | null }) => Promise<void>
}
export const AddOwnComponent = ({ onClick, setValues, values }: { onClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>, setValues: React.Dispatch<React.SetStateAction<string[]>>, values: string[] }) => {
  const addSizes = (e: ChangeEvent<HTMLInputElement>) => {
    setValues([...e.target.value.split(",")]);
  };
  const { t } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
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


        <CButton color="secondary" onClick={onClick} >
          {t("add")}
        </CButton>

      </div>
    </React.Fragment>
  );
};
const SizeAndColorModal = ({ product, updateSizeAndQuantity }: PropTypes) => {
  const _sizeAndColor: QuantityDetailsType[] = product.size_and_color && JSON.parse(product.size_and_color);
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
  const [values, setValues] = useState<string[]>([]);
  const selectedColor = useRef<HTMLSelectElement>(null);
  const selectedSize = useRef<HTMLSelectElement>(null);
  const [visible, setVisible] = useState(false);
  let sizeSymbols: string[] = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  let sizeNumbers: number[] = _.range(30, 51);

  const [sizesType, setSizesType] = useState<{ add: boolean, data: (string | number)[] }>({
    add: false,
    data: [...sizeSymbols],
  });
  const { t } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const addOwnSizes = () => {
    // let x = [
    //   ...sizesType.data,
    //   ...values.map((val) => {
    //     return { size: val, quantity: 0 };
    //   }),
    // ];

    // x = x.filter(
    //   (value, index, self) =>
    //     index ===
    //     self.findIndex((t) => t.size === value.size && t.color === value.color)
    // );
    setSizesType(x => { return { ...x, data: [...x.data, ...values] } });
    setValues([])
  };

  const closeQuantityModal = () => {
    setVisible(false);
    setSizeAndColor(_sizeAndColor)
  };
  const submitHandler = (e: FormEvent<HTMLFormElement> & { target: { quantityInput: HTMLInputElement } }) => {

    e.preventDefault();
    updateSizeAndQuantity({
      id: product.id,
      quantity:
        sizeAndColor?.reduce((p, c) => p + Number(c.quantity), 0) ||
        Number(e.target.quantityInput.value),
      size_and_color:
        sizeAndColor ? JSON.stringify(sizeAndColor) : null,
    });
    closeQuantityModal();

  };
  const select = (e: { name: string }[]) => {
    let x = [
      ...sizeAndColor,
      ...e.map((val) => {
        return { id: sizeAndColor.length + 1, size: val.name, color: null, quantity: 1, idx: sizeAndColor.length };
      }),
    ]

    x = x.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizeAndColor(x);
  };
  const remove = (e: { name: string }[]) => {
    let x = [
      ..._sizeAndColor,
      ...e.map((val) => {
        return { id: sizeAndColor.length + 1, size: val.name, color: null, quantity: 1, idx: sizeAndColor.length };
      }),
    ]

    setSizeAndColor(x);
  };
  const selectColors = (e: { name: string }[]) => {
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
  const removeColors = (e: { name: string }[]) => {
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
        color: selectedColor.current!.value,
        size: selectedSize.current!.value,
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
  const addSizes = (e: ChangeEvent<HTMLInputElement>) => {
    setValues(() => [...e.target.value.split(",")]);
  };

  const updateQuantity = (e: ChangeEvent<HTMLInputElement>, item: QuantityDetailsType) => {


    let s = sizeAndColor.map((val) => {
      if (val.id === item.id) {
        return { ...val, quantity: Number(e.target.value) };
      } else return val
    });

    setSizeAndColor(s)
  };
  const removeSize = (id: number | string) => {
    setSizeAndColor(x => x.filter(val => val.id !== id))
  }
  return (
    <>
      <CButton
        color="success"

        onClick={() => setVisible(true)}
      >
        <CIcon icon={cilStorage}></CIcon>
        {t("quantity")}
      </CButton>
      <CModal
        alignment="center"
        size={product.size_and_color ? "lg" : undefined}
        scrollable={true}
        visible={visible}
        onClose={() => closeQuantityModal()}
        fullscreen={!productColor && productSize}

      >
        <CModalHeader >
          <CModalTitle>{t("quantity")}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          {!product.size_and_color && (
            <CRow className="justify-content-center">
              <CCol xs='auto'>

              <CFormLabel htmlFor="quantityInput">{t("quantity")}: </CFormLabel>
              <CFormInput
                className="quantity"
                id="quantityInput"
                type="number"
                min="1"
                defaultValue={product.quantity}
              />
              </CCol>
            </CRow>
          )}
          <CRow className="justify-content-center" xs={{ gutter: 3 }} >
            <CCol md={6}>
              {productColor && !productSize && (
                <CRow className="justify-content-center padding" xs={{ gutter: 3 }}>
                  <CCol >
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
                  </CCol>
                </CRow>
              )}
              {productSize && !productColor && (
                <CRow className="padding" xs={{ gutterY: 2 }}>
                  <CCol xs={12}>
                    <input
                      type="radio"
                      name="choose"
                      className="form-check-input"
                      onChange={() =>
                        setSizesType((x) => {
                          return {
                            ...x,
                            data: [...sizeSymbols],
                            add: false,
                          };
                        })
                      }
                      id="symbolSizes"
                      checked={typeof sizesType.data[0] === 'string' && !sizesType.add}
                    />
                    <label htmlFor="symbolSizes">{t("symbolSizes")}</label>

                  </CCol>
                  <CCol xs={12}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="choose"
                      onChange={() =>
                        setSizesType({
                          ...sizesType,
                          data: [...sizeNumbers],
                          add: false,
                        })
                      }
                      id="numericSizes"
                      checked={typeof sizesType.data[0] === 'number' && !sizesType.add}
                    />
                    <label htmlFor="numericSizes">{t("numericSizes")}</label>
                  </CCol>
                  <CCol xs={12}>

                    <input
                      className="form-check-input"
                      type="radio"
                      name="choose"
                      onChange={() =>
                        setSizesType(x => {
                          return {
                            ...x,
                            add: true,
                          }
                        })
                      }
                      checked={sizesType.add}
                      id="addOther"
                    />
                    <label htmlFor="addOther">{t("addOther")}</label>
                  </CCol>
                  <CCol xs={12}>

                    {!sizesType.add && (
                      <Multiselect
                        options={sizesType.data.map((val, idx) => {
                          return { name: val, id: idx + 1 };
                        })}
                        onSelect={select}
                        onRemove={remove}
                        displayValue="name"
                        placeholder={t("select")}
                      />
                    )}
                  </CCol>



                  <CCol xs={12}>

                    {sizesType.add && (
                      <AddOwnComponent
                        setValues={setValues}
                        onClick={addOwnSizes}
                        values={values}
                      />
                    )}

                  </CCol>



                </CRow>

              )}
              {productSize && productColor && (
                <CRow className="padding" xs={{gutterY:3}}>
                  <CCol md={12} key={'string'}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sc"
                      onChange={() =>
                        setSizesType({
                          data: [...sizeSymbols],
                          add: false,
                        })
                      }
                      checked={typeof sizesType.data[0] === 'string' && !sizesType.add}
                      id="symbolSizes"
                    />
                    <label htmlFor="symbolSizes">{t("symbolSizes")}</label>
                  </CCol>
                  <CCol md={12} >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sc"
                      onChange={() =>
                        setSizesType({
                          data: [...sizeNumbers],
                          add: false,
                        })
                      }
                      checked={typeof sizesType.data[0] === 'number' && !sizesType.add}
                      id="numericSizes"
                    />
                    <label htmlFor="numericSizes">{t("numericSizes")}</label>
                  </CCol>
                  <CCol md={12} >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sc"

                      onChange={() => setSizesType({ ...sizesType, add: true })}
                      checked={sizesType.add}
                      id="addOther"
                    />
                    <label htmlFor="addOther">{t("addOther")} </label>
                  </CCol>
                  <CCol md={4}>
                    <CFormSelect ref={selectedSize}>
                      <option value="" disabled>
                        select size
                      </option>
                      {sizesType.data.map((val, idx) => (
                        <option key={`${idx}  ${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <ColorSelector selectStatement={true} ref={selectedColor} />
                  </CCol>
                  <CCol md={4}>
                    <CButton
                      color="secondary"
                      onClick={addSizeAndColor}
                    >
                      <CIcon icon={cilPlus} size="sm" />
                      {t("add")}
                    </CButton>
                  </CCol>
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
                  { }{" "}
                </ul>
              </CCol>
            )}
          </CRow>
          <CModalFooter>
            <CButton color="primary" type="submit">
              {t("submit")}
            </CButton>

            <CButton color="danger" onClick={() => closeQuantityModal()}>
              {t("cancel")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};

export default SizeAndColorModal;
