import React,{ useState } from "react";
import DeleteModal from "src/components/DeleteModal";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilTrash
} from "@coreui/icons";
import { useTranslation } from "react-i18next";
const DeleteProductModal = ({deleteHandler, product}) => {
    const [visible,setVisible] = useState(false)
    const { t, i18n } = useTranslation("translation", {
        keyPrefix: "addProduct",
      });
  return (
    <>
      <CButton color="danger" onClick={() => setVisible(true)}>
        <CIcon icon={cilTrash}></CIcon>
        {t("delete")}
      </CButton >
      <DeleteModal visible={visible} onDelete={deleteHandler} id={product.id} onClose={()=> setVisible(false)}/>
    </>
  );
};

export default DeleteProductModal;
