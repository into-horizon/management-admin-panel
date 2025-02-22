import { CButton, CTooltip } from '@coreui/react'
import React, { useState, useEffect, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

import Table, { ColumnType } from '../../components/Table'
import {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler,
  updateParentParams,
} from '../../store/category'
import AddCategoryModal from './components/AddCategoryModal'
import DeleteModal from '../../components/DeleteModal'
import { InputType } from '../../enums'
import { RootState } from '../../store'
import { ParentCategoriesType } from '../../types'

const Parent = () => {
  const {
    parentCategories: { data = [], count },
    isLoading,
    isProgressing,
    parentParams,
  } = useSelector((state: RootState) => state.category)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getParentCategoriesHandler())
  }, [parentParams])
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false)
    const deleteHandler = () => {
      dispatch(deleteParentCategoryHandler(id))
      setVisible(false)
    }
    return (
      <React.Fragment>
        <DeleteModal
          visible={visible}
          onClose={() => setVisible(false)}
          onDelete={deleteHandler}
          id={undefined}
        />
        <CTooltip content='Delete'>
          <CButton color='danger' onClick={() => setVisible(true)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CTooltip>
      </React.Fragment>
    )
  }

  const columns: ColumnType[] = [
    {
      header: 'english title',
      field: 'entitle',
      edit: {
        inputType: InputType.TEXT,
      },
    },
    {
      header: 'arabic title',
      field: 'artitle',
      edit: {
        inputType: InputType.TEXT,
      },
    },
    {
      header: 'meta title',
      field: 'metatitle',
      body: (data: ParentCategoriesType) => (data.metatitle ? data.metatitle : '-'),
      edit: {
        inputType: InputType.TEXT,
      },
    },
    { header: 'products count', field: 'products_count' },
  ]
  const addHandler = async (e: ParentCategoriesType) => {
    dispatch(addParentCategoryHandler(e))
  }
  const Actions = (data: ParentCategoriesType) => {
    return (
      <Fragment>
        <DeleteButton {...data} />
      </Fragment>
    )
  }
  const onPageChange = (n: number) => {
    setPageNumber(n)
    let newParams = {
      ...parentParams,
      offset: (parentParams.limit ?? 0) * (n - 1),
    }
    dispatch(updateParentParams(newParams))
  }
  return (
    <>
      <AddCategoryModal action={addHandler} type='parent' />
      <Table
        data={data}
        count={count}
        columns={columns}
        loading={isLoading}
        editable
        editFn={updateParentCategory}
        Actions={Actions}
        pageSize={10}
        onPageChange={onPageChange}
        pageNumber={pageNumber}
      />
    </>
  )
}

const mapDispatchToProps = {
  getParentCategoriesHandler,
  updateParentCategory,
  addParentCategoryHandler,
  deleteParentCategoryHandler,
}

export default connect(null, mapDispatchToProps)(Parent)
