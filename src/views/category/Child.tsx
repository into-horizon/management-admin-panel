import React, { useState, useEffect, FormEvent, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table, { ColumnType } from '../../components/Table'
import { cilTrash, cilSearch, cilFilterX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CTooltip, CButton, CForm, CRow, CCol, CFormInput } from '@coreui/react'
import FilterCard from '../../components/FilterCard'
import SearchDropdown, { OptionType } from '../../components/SearchDropdown'
import { InputType } from '../../enums'
import Category from '../../services/CategoryService'
import { RootState } from '../../store'
import {
  getChildCategoriesHandler,
  deleteChildCategoryHandler,
  resetChildParams,
  updateChildParams,
  addChildCategoryHandler,
  updateChildCategory,
} from '../../store/category'
import { ParentCategoriesType, ChildAndGrandCategoriesType } from '../../types'
import AddCategoryModal from './components/AddCategoryModal'
import DeleteModal from '../../components/DeleteModal'

const Child = () => {
  const {
    childCategories: { data, count },
    parentCategories: { data: parentCategories },
    childParams,
    isLoading,
  } = useSelector((state: RootState) => state.category)
  const [parentData, setParentData] = useState<ParentCategoriesType[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedValue, setSelectedValue] = useState<OptionType | null>(null)
  const [reset, setReset] = useState<boolean>(false)
  const dispatch = useDispatch()
  useEffect(() => {
    !selectedValue?.id && setReset(true)
  }, [selectedValue?.id])
  useEffect(() => {
    dispatch(getChildCategoriesHandler())
  }, [childParams])
  const DeleteButton = ({ id }: { id: string }) => {
    const [visible, setVisible] = useState(false)
    const deleteHandler = async () => {
      dispatch(deleteChildCategoryHandler(id))
      setVisible(false)
    }
    return (
      <React.Fragment>
        <DeleteModal visible={visible} onClose={() => setVisible(false)} onDelete={deleteHandler} />
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
      body: (e: ChildAndGrandCategoriesType) => `${e.p_entitle} - ${e.p_artitle}`,
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
  const onSelect = (e: typeof selectedValue) => {
    setSelectedValue(e)
  }
  const getParent = async (title: string) => {
    setLoading(true)
    try {
      const {
        data: { data },
      } = await Category.getAllParentCategoires({
        title: title,
      })
      setParentData(data)
    } finally {
      setLoading(false)
    }
  }
  const onChange = (e: string) => {
    getParent(e)
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      title: { value: string }
      reset(): void
    }
    const data: { parent_id?: string; title?: string } = {}

    if (selectedValue?.id) {
      data.parent_id = selectedValue.id
    }
    if (target.title.value) {
      data.title = target.title.value
    }
    dispatch(resetChildParams())
    dispatch(updateChildParams(data))
  }
  const resetFilter = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      title: { value: string }
      reset(): void
    }
    setSelectedValue(null)
    target.reset()
    dispatch(resetChildParams())
  }
  useEffect(() => {
    setParentData(parentCategories)
  }, [])

  const Actions = (data: ChildAndGrandCategoriesType) => {
    return (
      <Fragment>
        <DeleteButton {...data} />
      </Fragment>
    )
  }
  const onPageChange = (n: number) => {
    dispatch(updateChildParams({ offset: (childParams?.limit ?? 10) * (n - 1) }))
    setCurrentPage(n)
  }
  return (
    <>
      <AddCategoryModal action={addChildCategoryHandler} type='child' />
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetFilter}>
          <CRow className='justify-content-center align-items-end'>
            <CCol xs='auto'>
              <CFormInput id='title' placeholder='title' />
            </CCol>
            <CCol xs='auto'>
              <SearchDropdown
                options={parentData.map((x: ParentCategoriesType) => ({
                  id: x.id,
                  title: `${x.entitle} - ${x.artitle}`,
                }))}
                selectedValue={selectedValue}
                onSelect={onSelect}
                loading={loading}
                onChange={onChange}
                placeholder='search for parent category'
                reset={reset}
                resetCallback={setReset}
                delay={1000}
              />
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
      </FilterCard>
      <Table
        data={data}
        count={count}
        columns={columns}
        pageSize={childParams.limit}
        pageNumber={currentPage}
        loading={isLoading}
        editFn={updateChildCategory}
        onPageChange={onPageChange}
        editable
        Actions={Actions}
      />
    </>
  )
}

export default Child
