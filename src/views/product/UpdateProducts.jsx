import React, { useState, useEffect, Children } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { connect, useSelector, useDispatch } from 'react-redux'
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText, CSpinner } from '@coreui/react'
import { usePopup, DialogType, AnimationType, ToastPosition } from "react-custom-popup";
import {  getSearchedProductHandler, updateProductHandler } from "../../store/product"
import { useTranslation } from 'react-i18next';
import { addProductHandler, errorMessage } from 'src/store/product';
import {getParentCategoriesHandler,getChildCategoriesHandler,getGrandChildCategoriesHandler} from '../../store/category'
import Select from "react-dropdown-select";

const UpdateProduct = (props) => {
    const { showOptionDialog, showToast, showAlert } = usePopup();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const { message, searched, products } = useSelector(state => state.products)
    const {parentCategories:{data:parentCategories}, childCategories:{data:childCategories}, grandChildCategories:{data:grandChildCategories}} = useSelector(state => state.category)
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }
    const {  getSearchedProductHandler, addProductHandler, updateProductHandler } = props
  
    const [loading, setLoading] = useState(true)
    const search = useLocation().search;
    const navigate =  useNavigate()
    const id = new URLSearchParams(search).get("id");
    const initialState = {
        values: [],
        secondCategory: { visible: false },
        thirdCategory: { visible: false, selected: false, add: false, select: true },
        sizes: { visible: false, add: false },
        selectedSizes: [],
        sizesDetails: [],
        discount: { hasDiscount: false, discountRate: 0 }
    }

    const [secondCategory, setSecondCategory] = useState({ visible: true, data: childCategories.filter(c=> c.parent_id === searched.parent_category_id) })
    const [thirdCategory, setThirdCategory] = useState({ visible: true, selected: true, add: false, select: true, data: grandChildCategories.filter(g=> g.parent_id === searched.child_category_id) })

    
useEffect(()=>{
    setSecondCategory(x=> {return {...x, data: childCategories.filter(c=> c.parent_id === searched.parent_category_id)}})
    setThirdCategory(x=> {return {...x, data:  grandChildCategories.filter(g=> g.parent_id === searched.child_category_id), selected: !!searched.grandchild_category_id}})
},[searched.id])

    const submitHandler = (e, id) => {
        e.preventDefault();
        let obj = {
            id: id,
            entitle: e.target.entitle.value,
            artitle: e.target.artitle.value,
            metaTitle: e.target.metatitle.value,
            sku: e.target.sku.value,
            price: Number(e.target.price.value),
            brand_name: e.target.brandName.value,
            endescription: e.target.endescription.value,
            ardescription: e.target.ardescription.value,
            parent_category_id: e.target.parentCategory.value,
            child_category_id: e.target.childCategory.value,
            grandchild_category_id: e.target.grandChildCategory? e.target.grandChildCategory.value === 'default' ? null : e.target.grandChildCategory.value: null,
        }
        showOptionDialog({
            containerStyle: { width: 350 },
            text: "Updating your product will change its status to `Pending`",
            title: 'Updating Product?',
            options: [
              {
                name: 'Cancel',
                type: 'cancel',
              },
              {
                name: 'Update',
                type: 'confirm',
                style: { background: 'lightcoral' },
              },
            ],
            onConfirm: () =>
            updateProductHandler(obj).then(()=> navigate(-1))
              
          })
        // console.log("🚀 ~ file: UpdateProducts.jsx ~ line 69 ~ submitHandler ~ obj", obj)

        // updateProductHandler(obj)

    }
    const categoryVisibility = e => {
        let x = { ...secondCategory, visible: true }
        setSecondCategory({data: childCategories.filter(c=> c.parent_id === e.target.value), visible: true})
        setThirdCategory(x => {return{...x,data: []}})
    }
    const categoryVisibility2 = e => {
       
        setThirdCategory(x=>{return{...x,data: grandChildCategories.filter(c=> c.parent_id === e.target.value), visible: true}})
    }

    useEffect(() => {
        
        Promise.all([getParentCategoriesHandler(),getChildCategoriesHandler(),getGrandChildCategoriesHandler(), id && getSearchedProductHandler(id)]).then(()=> setLoading(false))
       
        
    }, [])
   
    useEffect(() => {
        let labels = document.querySelectorAll('#label')
        if (i18n.language === 'ar') {
            labels.forEach(label => label.setAttribute('class', 'rightBorder'))
        } else if (i18n.language === 'en') {
            labels.forEach(label => label.setAttribute('class', 'leftBorder'));
        }
    }, [searched, i18n.language])
  
    return (
        <div className="r">
            <h2>update product</h2>
            {/* <div style={{ width: '50%', margin: 'auto' }}>
                <Select options={options} onChange={changeHandler} labelField='name' searchable={true} searchBy='name' direction='auto' loading={loading} />
            </div> */}
           { loading  ? <CSpinner/>: 
            <div>
                {searched?.id && <form id='productForm' className="productForm" onSubmit={e => submitHandler(e, searched.id)}>
                    <section className="productInputs">
                        <div>
                            <label>{t('englishTitle')}*</label>
                            <input type="text" id="entitle" placeholder={t('englishTitle')} required defaultValue={searched.entitle} />
                        </div>
                        <div>
                            <label id="label">{t('arabicTitle')}*</label>
                            <input type="text" id="artitle" placeholder={t('arabicTitle')} required defaultValue={searched.artitle} />
                        </div>
                        <div>
                            <label id="label">{t('metaTitle')}</label>
                            < input type="text" id="metatitle" placeholder={t('metaTitle')} defaultValue={searched.metaTitle} />
                        </div>
                        <div>
                            <label >SKU</label>
                            < input type="text" id="sku" placeholder="SKU" defaultValue={searched.sku} />
                        </div>
                        <div>
                            <label id="label">{t('price')}*</label>
                            < input type="number" id="price" placeholder={t('price')} step='0.01' required defaultValue={searched.price} />
                        </div>
                        <div>
                            <label id="label">{t('brandName')}</label>
                            <input type="text" id="brandName" placeholder={t('brandName')} defaultValue={searched.brand_name} />
                        </div>

                    </section>
                    <div className='marginDiv'>
                        <div className='description'>

                            <CFormFloating>
                                <CFormTextarea
                                    placeholder="Leave a comment here"
                                    id="endescription"
                                    style={{ height: '100px' }}
                                    defaultValue={searched.endescription}
                                ></CFormTextarea>
                                <CFormLabel htmlFor="floatingTextarea2" value={searched.endescription} required>{t('englishDescrition')}*</CFormLabel>
                            </CFormFloating>
                            <CFormFloating>
                                <CFormTextarea
                                    placeholder="Leave a comment here"
                                    id="ardescription"
                                    defaultValue={searched.ardescription}
                                    style={{ height: '100px' }}
                                ></CFormTextarea>
                                <CFormLabel htmlFor="floatingTextarea3" required>{t('arabicDescription')}*</CFormLabel>
                            </CFormFloating>

                        </div>

                    </div>
                    <div className='marginDiv'>
                        <CFormSelect aria-label="Default select example" required onChange={categoryVisibility} id='parentCategory' defaultValue={searched.parent_category_id} >
                            {/* <option value={searched.parent_category_id}>{searched.p_entitle}</option> */}
                            {parentCategories.map((val, idx) =>
                                <option value={val.id} key={`parent_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                            )

                            }

                        </CFormSelect>
                    </div>
                    <div className='marginDiv'>
                        <CFormSelect aria-label="Default select example" disabled={secondCategory.data.length ===0} onChange={categoryVisibility2} id='childCategory' defaultValue={searched.child_category_id}>

                            {secondCategory.data.map((val, idx) =>
                                <option value={val.id} key={`child_Category_${idx}`} >{val[`${i18n.language}title`]}</option>
                            )

                                }
                        </CFormSelect>
                    </div>

                    <section className="TCS" >
                        <section>
                            <CFormCheck id="flexCheckDefault" label={t('selectOrAdd')} onChange={e => setThirdCategory({ ...thirdCategory, selected: e.target.checked })} defaultChecked={(!!searched.grandchild_category_id || thirdCategory.selected)} />
                      </section>
                            {(thirdCategory.selected) && <section style={{  width: '20%' }}>
                            <section>
                                <CFormCheck type="radio" name="TC" id="TC1" label={t('selectThird')} defaultChecked onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} />

                            </section>
                            <section>

                                <CFormCheck type="radio" name="TC" id="TC2" label={t('addOwn')} onChange={e => setThirdCategory({ ...thirdCategory, select: !thirdCategory.select, add: !thirdCategory.add })} disabled />
                            </section>

                            {thirdCategory.select && <CFormSelect aria-label="Default select example" id='grandChildCategory' disabled={thirdCategory.data.length ===0} defaultValue={searched.grandchild_category_id}>
                                <option value='default'>{t('grandChildCategory')}</option>

                                {thirdCategory.data.map((val, idx) =>
                                    <option value={val.id} key={`grand_child_Category_${idx}`}>{val[`${i18n.language}title`]}</option>
                                )

                                    }
                            </CFormSelect>}


                            <input type={thirdCategory.add ? 'text' : 'hidden'} placeholder={t('addOwn')} className='thirdCategory' disabled={!thirdCategory.visible} id='addGrandChildCategory' />
                        </section>}


                    </section>

                    <CButton type="submit" color="primary">
                        {t('submit')}
                    </CButton>
                </form>}
            </div>}
        </div>
    )
}

const mapDispatchToProps = {  getSearchedProductHandler, addProductHandler, updateProductHandler }
export default connect(null, mapDispatchToProps)(UpdateProduct)