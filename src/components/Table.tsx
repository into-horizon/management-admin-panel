import React, { useState, useEffect, Children, Component } from "react";
import Paginator from "./Paginator";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CSpinner,
  CRow,
  CCol,
  CFormSelect,
  CFormLabel,
  CButton,
  CTooltip,
  CFormInput,
} from "@coreui/react";
import _ from "lodash";
import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import { cilCheck, cilPen, cilX } from "@coreui/icons";
import TableEditCell from "./TableEditCell";
import { GetFunctionType, ParamsType } from "src/types";
import { InputType } from "src/enums";
import LoadingSpinner from "./LoadingSpinner";

export type ColumnType = {
  header: string;
  field?: string;
  body?: React.FC<any> | ((a: any) => React.JSX.Element);
  edit?:
    | {
        inputType: Exclude<InputType, "dropdown">;
      }
    | {
        inputType: InputType.DROPDOWN;
        options: { value: string; name: string }[];
      };
};
type PropTypes = {
  updateLoading: React.Dispatch<React.SetStateAction<boolean>>;
  params: { limit?: number; offset?: number } & {};
  count: number;
  columns: ColumnType[];
  data: { id?: string }[];
  changeData?: GetFunctionType;
  cookieName?: string;
  style?: React.CSSProperties;
  emptyMessage?: string;
  checkbox?: boolean;
  onSelect?: React.Dispatch<React.SetStateAction<any[]>>;
  updateParams?: React.Dispatch<React.SetStateAction<{}>>;
  loading?: boolean;
  displayedItems?: boolean;
  pagination?: boolean;
  editable?: boolean | undefined;
  editFn?: Function;
  Actions?: typeof Component | ((a: any) => React.JSX.Element);
  onPageChange?: (page: number) => void;
  pageNumber?: number;
  pageSize?: number;
};
export const Table = ({
  updateLoading,
  params,
  count,
  columns,
  data,
  changeData,
  cookieName,
  style,
  emptyMessage,
  checkbox,
  onSelect,
  updateParams,
  loading,
  displayedItems,
  pagination = true,
  editable,
  editFn,
  Actions,
  onPageChange,
  pageNumber,
  pageSize
}: PropTypes) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [onEdit, setOnEdit] = useState<string | null | number>("");
  const [item, setItem] = useState<{}>({});
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected((x) => [...x, e.target.value]);
    } else {
      setSelected((x) => x.filter((w) => w !== e.target.value));
    }
  };
  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((s) => s.id));
    } else {
      setSelected([]);
    }
  };
  let displayItems: number[] = _.range(5, 100, 5);
  useEffect(() => {
    checkbox && onSelect?.(selected);
  }, [selected]);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams?.((x) => {
      changeData?.({ ...x, limit: Number(e.target.value) });
      return { ...x, limit: Number(e.target.value) };
    });
  };

  const updateItem = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setItem((x) => {
      return { ...x, [e.target.id]: e.target.value };
    });
  };
  const editClick = () => {
    editFn && Promise.all([editFn(item)]).then(() => setOnEdit(""));
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <CRow className=" overflow-x-auto ">
        <CCol xs={12}>
          <CTable style={style} striped>
            <CTableHead>
              <CTableRow>
                {checkbox && (
                  <CTableDataCell>
                    <CFormCheck onChange={selectAll} />
                  </CTableDataCell>
                )}
                {Children.toArray(
                  columns.map(({ header }) => (
                    <CTableHeaderCell scope="col">{header}</CTableHeaderCell>
                  ))
                )}
                {(editable || Actions) && (
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                )}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Children.toArray(
                data.map((d, i) => (
                  <CTableRow>
                    {checkbox && (
                      <CTableDataCell>
                        <CFormCheck
                          value={d.id}
                          onChange={onChange}
                          checked={selected.includes(d.id)}
                        />
                      </CTableDataCell>
                    )}
                    {Children.toArray(
                      columns.map(({ field, body: Body, edit }) => {
                        if (i === onEdit) {
                          return (
                            <CTableDataCell>
                              {edit && edit.inputType ? (
                                <TableEditCell
                                  type={edit.inputType}
                                  id={field ? field : ""}
                                  onChange={updateItem}
                                  value={
                                    field && item[field as keyof typeof item]
                                      ? item[field as keyof typeof item]
                                      : ""
                                  }
                                  options={
                                    edit.inputType === InputType.DROPDOWN
                                      ? edit.options
                                      : []
                                  }
                                />
                              ) : (
                                item[field as keyof typeof item] ?? "-"
                              )}
                            </CTableDataCell>
                          );
                        }
                        return Body ? (
                          <CTableDataCell>
                            <Body {...d} />
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            {String(
                              field && d[field as keyof typeof d]
                                ? d[field as keyof typeof d]
                                : "" ?? "-"
                            )}
                          </CTableDataCell>
                        );
                      })
                    )}
                    {editable && (
                      <CTableDataCell>
                        {i === onEdit ? (
                          <>
                            <CTooltip content="confirm">
                              <CButton color="success" onClick={editClick}>
                                <CIcon icon={cilCheck} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="cancel">
                              <CButton
                                color="danger"
                                onClick={() => setOnEdit("")}
                              >
                                <CIcon icon={cilX} />
                              </CButton>
                            </CTooltip>
                          </>
                        ) : (
                          <>
                            <CTooltip content="edit">
                              <CButton
                                color="secondary"
                                onClick={() => {
                                  setOnEdit(i);
                                  setItem(d);
                                }}
                              >
                                <CIcon icon={cilPen} />
                              </CButton>
                            </CTooltip>
                            {Actions && <Actions {...d} />}
                          </>
                        )}
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCol>
        <CCol xs={12}>
          {pagination &&
            (data.length === 0 ? (
              <span>{emptyMessage ?? `there's no data`}</span>
            ) : (
              <CRow className="justify-content-between align-items-end w-100">
                <CCol xs="auto">
                  <Paginator
                    params={params}
                    count={count}
                    changeData={changeData}
                    cookieName={cookieName}
                    updateParams={updateParams}
                    updateLoading={updateLoading}
                    onPageChange={onPageChange}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                  />
                </CCol>
                {displayedItems && (
                  <CCol xs="auto">
                    <CRow className="align-items-center">
                      <CCol xs="auto">
                        <CFormLabel htmlFor="display">
                          Displayed Items
                        </CFormLabel>
                      </CCol>
                      <CCol xs="auto">
                        <CFormSelect
                          name="display"
                          onChange={changeHandler}
                          value={params.limit}
                        >
                          {Children.toArray(
                            displayItems.map((val) => (
                              <option value={val}>{val}</option>
                            ))
                          )}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  </CCol>
                )}
              </CRow>
            ))}
        </CCol>
      </CRow>
    </>
  );
};

export default Table;
