import React, { useState, Children, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CRow, CCol, CFormSelect } from '@coreui/react'
import { RootState } from '../../../store'
import { ChildAndGrandCategoriesType, ParentCategoriesType } from '../../../types'

const FormBody = () => {
  const dispatch = useDispatch()
  const {
    parentCategories: { data: parentCategories }, 
    childCategories: { data: childCategories },
    grandChildCategories: { data: grandChildCategories },
    categories,
  } = useSelector((state: RootState) => state.category)
  const [secondCategories, setSecondCategories] = useState<ChildAndGrandCategoriesType[]>([])
  const [thirdCategories, setThirdCategories] = useState<ChildAndGrandCategoriesType[]>([])

  const onSelectParent = (e: ChangeEvent<HTMLSelectElement>) => {
    setSecondCategories(
      categories.find((category) => category.id === e.target.value)?.children ?? [],
    )
    setThirdCategories([])
  }
  const onSelectChild = (e: ChangeEvent<HTMLSelectElement>) => {
    setThirdCategories(
      secondCategories.find((category) => category.id === e.target.value)?.children ?? [],
    )
  }
  return (
    <CCol xs={4}>
      <CRow xs={{ gutterY: 3 }}>
        <CCol xs={12}>
          <CFormSelect onChange={onSelectParent} id='parent_category_id'>
            <option value={''}>Select first category</option>
            {Children.toArray(
              categories.map((category: ParentCategoriesType) => (
                <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>
              )),
            )}
          </CFormSelect>
        </CCol>
        <CCol xs={12}>
          <CFormSelect
            disabled={secondCategories.length === 0}
            onChange={onSelectChild}
            id='child_category_id'
            defaultValue={''}
          >
            <option value={''}>Select second category</option>
            {Children.toArray(
              secondCategories.map((category: ChildAndGrandCategoriesType) => (
                <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>
              )),
            )}
          </CFormSelect>
        </CCol>
        <CCol xs={12}>
          <CFormSelect
            disabled={thirdCategories.length === 0}
            id='grandchild_category_id'
            defaultValue={''}
          >
            <option value=''>Select third category</option>
            {Children.toArray(
              thirdCategories.map((category: ChildAndGrandCategoriesType) => (
                <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>
              )),
            )}
          </CFormSelect>
        </CCol>
      </CRow>
    </CCol>
  )
}

export default FormBody
