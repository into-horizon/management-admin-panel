import React, { useState, useEffect, Dispatch, FC, Children, memo } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import cookie from "react-cookies";
import _ from "lodash";
import { ParamsType } from "src/types";

type PropTypes = {
  count: number;
  changeData?: (p: ParamsType) => Promise<void>;
  cookieName?: string;
  params: ParamsType;
  updateParams?: Dispatch<React.SetStateAction<{}>>;
  updateLoading?: Dispatch<React.SetStateAction<boolean>>;
  onPageChange?: (page: number) => void;
  pageNumber?: number;
  pageSize?: number;
};

const Paginator: FC<PropTypes> = ({
  count,
  changeData,
  cookieName,
  params,
  updateParams,
  updateLoading,
  onPageChange,
  pageNumber,
  pageSize,
}) => {
  const [pages, setPages] = useState<(string | number)[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(
    (cookieName ? Number(cookie.load(cookieName)) : pageNumber?? 1) ?? 1
  );
  const siblingCount = 5;
  let pagesCount = Math.ceil(count / (params?.limit ?? pageSize ?? 5) || 1);
  useEffect(() => {
    pagesCount = Math.ceil(count / (params?.limit ?? pageSize ?? 5) || 1);
    let p: (number | string)[] = [];
    if (pagesCount < selectedPage) {
      setSelectedPage(1);
    }
    if (pagesCount < siblingCount) {
      p = _.range(1, pagesCount + 1);
    } else {
      let firstPages = [1, 2, 3];
      let lastPages = [pagesCount - 2, pagesCount - 1, pagesCount];
      if (selectedPage === 1) {
        p = [...firstPages, "...", ...lastPages];
      } else if (selectedPage === pagesCount) {
        p = [...firstPages, "...", ...lastPages];
      } else if (firstPages.includes(selectedPage)) {
        p = [
          1,
          selectedPage - 1,
          selectedPage,
          selectedPage + 1,
          "...",
          ...lastPages,
        ];
      } else if (lastPages.includes(selectedPage)) {
        p = [
          1,
          ...firstPages,
          "...",
          selectedPage - 1,
          selectedPage,
          selectedPage + 1,
          pagesCount,
        ];
      } else {
        if (firstPages.includes(selectedPage - 1)) {
          p = [
            ...firstPages.splice(0, 2),
            selectedPage - 1,
            selectedPage,
            selectedPage + 1,
            "....",
            ...lastPages.slice(1),
          ];
        } else if (lastPages.includes(selectedPage + 1)) {
          p = [
            ...firstPages.splice(0, 2),
            "...",
            selectedPage - 1,
            selectedPage,
            selectedPage + 1,
            ...lastPages.slice(1),
          ];
        } else {
          p = [
            ...firstPages.splice(0, 2),
            "...",
            selectedPage - 1,
            selectedPage,
            selectedPage + 1,
            "....",
            ...lastPages.slice(1),
          ];
        }
      }
    }

    setPages(() =>
      p.filter(
        (s: string | number, i: number, a: (string | number)[]) =>
          a.indexOf(s) === i
      )
    );
  }, [count, selectedPage, params]);

  const changePage = async (n: number) => {
    setSelectedPage(n);
    cookieName && cookie.save(cookieName, n, { path: "/" });
    updateLoading?.(true);
    await changeData?.({
      ...params,
      limit: params?.limit ?? 5,
      offset: (params?.limit ?? 5) * (n - 1),
    });
    updateLoading?.(false);
    updateParams?.({
      ...params,
      limit: params?.limit ?? 5,
      offset: (params?.limit ?? 5) * (n - 1),
    });
    onPageChange?.(n);
  };
  return (
    <CPagination aria-label="Page navigation example" className="paginator">
      <CPaginationItem
        aria-label="Previous"
        onClick={() => changePage(selectedPage - 1 < 1 ? 1 : selectedPage - 1)}
        disabled={selectedPage === 1}
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>

      {Children.toArray(
        pages.map((val: string | number) => (
          <CPaginationItem
            disabled={typeof val === "string" && val.includes(".")}
            active={selectedPage === val}
            onClick={() => typeof val === "number" && changePage(val)}
          >
            {val}
          </CPaginationItem>
        ))
      )}

      <CPaginationItem
        aria-label="Next"
        onClick={() =>
          changePage(
            selectedPage + 1 > pages.length ? pages.length : selectedPage + 1
          )
        }
        disabled={selectedPage === pagesCount}
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  );
};

export default memo(Paginator);
