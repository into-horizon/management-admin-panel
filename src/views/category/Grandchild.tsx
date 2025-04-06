import React, { useState, useEffect, Children, FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table, { ColumnType } from '../../components/Table'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilSearch, cilFilterX } from '@coreui/icons'
import { CButton, CCol, CForm, CFormInput, CRow, CTooltip } from '@coreui/react'
import DeleteModal from '../../components/DeleteModal'
import SearchDropdown, { OptionType } from '../../components/SearchDropdown'
import { InputType } from '../../enums'
import Category from '../../services/CategoryService'
import { RootState } from '../../store'
import {
  getGrandChildCategoriesHandler,
  deleteGrandchildCategoryHandler,
  resetGrandChildParams,
  updateGrandchildParams,
  addGrandchildCategoryHandler,
  updateGrandChildCategory,
} from '../../store/category'
import { ChildAndGrandCategoriesType } from '../../types'
import AddCategoryModal from './components/AddCategoryModal'

const Grandchild = () => {
  const {
    grandChildCategories: { data, count },
    isLoading,
    grandchildParams,
  } = useSelector((state: RootState) => state.category)
  const [childData, setChildData] = useState<ChildAndGrandCategoriesType[]>([])
  const [value, setValue] = useState<OptionType | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [reset, setReset] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  useEffect(() => {
    !value?.id && setReset(true)
  }, [value?.id])
  useEffect(() => {
    dispatch(getGrandChildCategoriesHandler())
  }, [grandchildParams])
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false)
    const deleteHandler = () => {
      dispatch(deleteGrandchildCategoryHandler(id))
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
      header: 'parent title',
      field: 'p_artitle',
      body: (e: ChildAndGrandCategoriesType) =>
        `${e.child_category?.entitle} - ${e.child_category?.artitle}`,
    },

    {
      header: 'meta title',
      field: 'metatitle',
      body: (data: ChildAndGrandCategoriesType) => (data.metatitle ? data.metatitle : '-'),
      edit: {
        inputType: InputType.TEXT,
      },
    },
    { header: 'products count', field: 'products_count' },
  ]

  const getChild = async (title: string) => {
    let {
      data: { data },
    } = await Category.getAllChildCategoires({ title: title })
    setChildData(data)
    setSearchLoading(false)
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & { title: { value: string } }
    let data: { title?: string; parent_id?: string } = {}
    target.title.value && (data.title = target.title.value)
    if (value?.id) {
      data.parent_id = value.id
    }
    dispatch(resetGrandChildParams())
    dispatch(updateGrandchildParams({ ...data }))
  }

  const clearFilter = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & { reset: () => void }
    target.reset()
    dispatch(resetGrandChildParams())
    setValue(null)
  }
  const onChange = (e: string) => {
    setSearchLoading(true)
    setTimeout(() => getChild(e), 1000)
  }
  const addCategoryHandler = async (c: ChildAndGrandCategoriesType) => {
    addGrandchildCategoryHandler(c)
  }
  const Actions = (data: ChildAndGrandCategoriesType) => {
    return (
      <>
        <DeleteButton {...data} />
      </>
    )
  }
  const onPageChange = (n: number) => {
    setCurrentPage(n)
    dispatch(
      updateGrandchildParams({
        offset: (grandchildParams.limit ?? 10) * (n - 1),
      }),
    )
  }
  return (
    <>
      <AddCategoryModal type='grand' action={addCategoryHandler} />
      <div className='card padding mrgn25'>
        <CForm onSubmit={submitHandler} onReset={clearFilter}>
          <CRow className='justify-content-center align-items-end' xs={{ gutter: 1 }}>
            <CCol xs='auto'>
              <CFormInput id='title' placeholder='title' />
            </CCol>
            <CCol xs='auto'>
              {Children.toArray(
                <SearchDropdown
                  options={childData.map((val) => {
                    return {
                      title: `${val.entitle} - ${val.artitle}`,
                      id: val.id,
                    }
                  })}
                  placeholder='select child category'
                  onChange={onChange}
                  onSelect={(e) => setValue(e)}
                  loading={searchLoading}
                />,
              )}
            </CCol>
            <CCol xs='auto'>
              <CTooltip content='search'>
                <CButton type='submit'>
                  <CIcon icon={cilSearch} />
                </CButton>
              </CTooltip>
            </CCol>
            <CCol xs='auto'>
              <CTooltip content='clear filter'>
                <CButton color='secondary' type='reset'>
                  <CIcon icon={cilFilterX} />
                </CButton>
              </CTooltip>
            </CCol>
          </CRow>
        </CForm>
      </div>
      <Table
        data={data}
        count={count}
        columns={columns}
        loading={isLoading}
        onPageChange={onPageChange}
        Actions={Actions}
        pageNumber={currentPage}
        pageSize={10}
        editable
        editFn={updateGrandChildCategory}
      />
    </>
  )
}

export default Grandchild
