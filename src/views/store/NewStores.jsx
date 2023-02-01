import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getPendingStores } from "../../store/store";
import Table from "src/components/Table";


import ActionModal from "./ActionModal";
export const NewStores = ({ getPendingStores }) => {
  const { data, count } = useSelector((state) => state.stores.pending);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  useEffect(() => {
    Promise.all([getPendingStores()]).then(() => setLoading(false));
  }, []);

  const columns = [
    { header: "store name", field: "store_name" },
    { header: "email verified", field: "verified_email" },
    { header: "mobile", field: "mobile" },
    { header: "status", field: "status" },
    { header: "verification code", field: "verification_code" },
    { header: "action", field: "action", body: ActionModal },
  ];
  return (
    <>
      <Table
        data={data}
        count={count}
        loading={loading}
        columns={columns}
        params={params}
        changeData={getPendingStores}
        updateParams={setParams}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getPendingStores };

export default connect(mapStateToProps, mapDispatchToProps)(NewStores);
