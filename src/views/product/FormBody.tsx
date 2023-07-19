import React, {useState, useEffect, Children} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
    CRow,
    CCol,
    CFormSelect,
  } from "@coreui/react";
  import {getChildCategoriesHandler,getGrandChildCategoriesHandler,getGrandChildCategories} from '../../store/category'
import { RootState } from 'src/store';
import { ParamsType, ParentCategoriesType, ChildAndGrandCategoriesType } from 'src/types';


 type PropTypes ={
  getChildCategoriesHandler :( p: ParamsType) => Promise<void>,
  getGrandChildCategoriesHandler :( p: ParamsType) => Promise<void>
 } 
 const FormBody = ({getChildCategoriesHandler,getGrandChildCategoriesHandler}: PropTypes) => {
  const dispatch = useDispatch()
    const {parentCategories:{data:parentCategories}, childCategories:{data:childCategories},grandChildCategories:{data:grandChildCategories}} = useSelector((state: RootState)=>state.category)
    const [secondCategories, setSecondCategories] = useState({parent_id: '',data:[]})
    const [thirdCategories, setThirdCategories] = useState({parent_id: '',data:[]})
    useEffect(()=>{
      if(secondCategories.parent_id !== '') {
        
        getChildCategoriesHandler({parent_id:secondCategories.parent_id })
        dispatch(getGrandChildCategories({data: []}))
       
  
      }
    },[secondCategories.parent_id])
    useEffect(()=>{
      if(thirdCategories.parent_id&& thirdCategories.parent_id !== '') {
        getGrandChildCategoriesHandler({parent_id:thirdCategories.parent_id })
      }
    },[thirdCategories.parent_id])
   
  return (
    <CCol xs={4}>
    <CRow xs={{ gutterY: 3 }}>
      <CCol xs={12}>
        <CFormSelect onChange={e=> setSecondCategories(x=> {return{...x, parent_id: e.target.value}})} id='parent_category_id'>
          <option value={''}>Select first category</option>
          {Children.toArray(parentCategories.map((category: ParentCategoriesType) => <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>))}
        </CFormSelect >
      </CCol>
      <CCol xs={12}>
        <CFormSelect disabled={childCategories.length === 0} onChange={e=> setThirdCategories(x=> {return{...x, parent_id: e.target.value}})} id='child_category_id' defaultValue={''}>
          <option value={''}>Select second category</option>
          {Children.toArray(childCategories.map((category: ChildAndGrandCategoriesType) => <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>))}
        </CFormSelect>
      </CCol>
      <CCol xs={12}>
        <CFormSelect disabled={grandChildCategories.length === 0 || childCategories.length === 0}  id='grandchild_category_id' defaultValue={''}>
          <option value=''>Select third category</option>
          {Children.toArray(grandChildCategories.map((category: ChildAndGrandCategoriesType) => <option value={category.id}>{`${category.entitle} - ${category.artitle}`}</option>))}
        </CFormSelect>
      </CCol>
    </CRow>
  </CCol>
  )
}


const mapDispatchToProps = {getChildCategoriesHandler,getGrandChildCategoriesHandler}

export default connect(null, mapDispatchToProps)(FormBody)