import React, { useState, useEffect, FormEvent, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import Table, { ColumnType } from '../../components/Table'
import EditableCell from 'src/components/EditableCell'
import {
  getChildCategoriesHandler,
  updateChildCategory,
  addChildCategoryHandler,
  deleteChildCategoryHandler,
  updateChildParams,
  resetChildParams,
} from 'src/store/category'
import AddCategoryModal from 'src/views/category/components/AddCategoryModal'
import DeleteModal from 'src/components/DeleteModal'
import { CButton, CCol, CForm, CFormInput, CRow, CTooltip } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilSearch, cilFilterX } from '@coreui/icons'
import Category from 'src/services/CategoryService'
import SearchDropdown, { OptionType } from 'src/components/SearchDropdown'
import FilterCard from 'src/components/FilterCard'
import { RootState } from 'src/store'
import { ChildAndGrandCategoriesType, ParentCategoriesType } from 'src/types'
import { InputType } from 'src/enums'

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
    let {
      data: { data },
    } = await Category.getAllParentCategoires({
      title: title,
    })
    setLoading(false)
    setParentData(data)
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
    let data: { parent_id?: string; title?: string } = {}
    selectedValue?.id && (data['parent_id'] = selectedValue.id)
    target.title.value && (data['title'] = target.title.value)
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
        pageSize={10}
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
