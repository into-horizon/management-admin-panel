import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


type PropTypes = {
  visible: boolean,
  onClose: () => void,
  onDelete: Function,
  id?: string ,
}
export const DeleteModal = ({ visible, onClose, onDelete, id }:PropTypes)  => {
  const { t } = useTranslation("translation", { keyPrefix: "globals" });
  const deleteHandler = () => {
    if(id) {
      onDelete(id)
    } else {
      onDelete()
    }
    onClose();
  };
  return (
    <CModal
      onClose={onClose}
      visible={visible}
      alignment="center"
      backdrop={false}
      transition={true}
    >
      <CModalHeader>
        <CModalTitle>{t("deleteTitle")}</CModalTitle>
      </CModalHeader>
      <CModalBody>{t("deleteText")}</CModalBody>
      <CModalFooter>
        <CButton onClick={deleteHandler} color="danger">
          {t("delete")}
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          {t("cancel")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};


const mapDispatchToProps = {};

export default connect(null, mapDispatchToProps)(DeleteModal);
