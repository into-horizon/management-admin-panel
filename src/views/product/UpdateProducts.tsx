import React, { useState, useEffect, Children, FormEvent, ChangeEvent } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { connect, useSelector, useDispatch } from 'react-redux'
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText, CSpinner } from '@coreui/react'
import { usePopup, DialogType, AnimationType, ToastPosition } from "react-custom-popup";
import { getSearchedProductHandler, updateProductHandler } from "../../store/product"
import { useTranslation } from 'react-i18next';
import { getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler } from '../../store/category'
import { RootState } from 'src/store';
import _ from 'lodash';
import { ProductType, GetFunctionType } from 'src/types';


type PropTypes = {
    getSearchedProductHandler: (id: string) => Promise<void>,
    updateProductHandler: (product: ProductType) => Promise<void>,
    getParentCategoriesHandler: GetFunctionType,
    getChildCategoriesHandler: GetFunctionType,
    getGrandChildCategoriesHandler: GetFunctionType
}
const UpdateProduct = ({ getSearchedProductHandler, updateProductHandler, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }: PropTypes) => {
    const { showOptionDialog, showToast, showAlert } = usePopup();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const { searched } = useSelector((state: RootState) => state.products)
    const { parentCategories: { data: parentCategories }, childCategories: { data: childCategories }, grandChildCategories: { data: grandChildCategories } } = useSelector((state: RootState) => state.category)
    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers: number[] = _.range(30, 51);

    const [loading, setLoading] = useState(true)
    const search = useLocation().search;
    const navigate = useNavigate()
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

    const [secondCategory, setSecondCategory] = useState({ visible: true, data: childCategories.filter(c => c.parent_id === searched.parent_category_id) })
    const [thirdCategory, setThirdCategory] = useState({ visible: true, selected: true, add: false, select: true, data: grandChildCategories.filter(g => g.parent_id === searched.child_category_id) })


    useEffect(() => {
        setSecondCategory(x => { return { ...x, data: childCategories.filter(c => c.parent_id === searched.parent_category_id) } })
        setThirdCategory(x => { return { ...x, data: grandChildCategories.filter(g => g.parent_id === searched.child_category_id), selected: !!searched.grandchild_category_id } })
    }, [searched.id])

    type TargetType = {
        entitle: HTMLInputElement
        artitle: HTMLInputElement
        metatitle: HTMLInputElement
        sku: HTMLInputElement
        price: HTMLInputElement
        brandName: HTMLInputElement
        endescription: HTMLTextAreaElement
        ardescription: HTMLTextAreaElement
        parentCategory: HTMLSelectElement
        childCategory: HTMLSelectElement
        grandChildCategory?: HTMLSelectElement
    }
    const submitHandler = (e: FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        const target = e.target as typeof e.target & TargetType
        let obj = {
            id: id,
            entitle: target.entitle.value,
            artitle: target.artitle.value,
            metatitle: target.metatitle.value,
            sku: target.sku.value,
            price: Number(target.price.value),
            brand_name: target.brandName.value,
            endescription: target.endescription.value,
            ardescription: target.ardescription.value,
            parent_category_id: target.parentCategory.value,
            child_category_id: target.childCategory.value,
            grandchild_category_id: target.grandChildCategory ? target.grandChildCategory.value === 'default' ? null : target.grandChildCategory.value : null,
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
                updateProductHandler({ ...searched, ...obj }).then(() => navigate(-1))

        })
        // console.log("🚀 ~ file: UpdateProducts.jsx ~ line 69 ~ submitHandler ~ obj", obj)

        // updateProductHandler(obj)

    }
    const categoryVisibility = (e: ChangeEvent<HTMLSelectElement>) => {
        let x = { ...secondCategory, visible: true }
        setSecondCategory({ data: childCategories.filter(c => c.parent_id === e.target.value), visible: true })
        setThirdCategory(x => { return { ...x, data: [] } })
    }
    const categoryVisibility2 = (e: ChangeEvent<HTMLSelectElement>) => {

        setThirdCategory(x => { return { ...x, data: grandChildCategories.filter(c => c.parent_id === e.target.value), visible: true } })
    }

    useEffect(() => {

        Promise.all([getParentCategoriesHandler({}), getChildCategoriesHandler({}), getGrandChildCategoriesHandler({}), id && getSearchedProductHandler(id)]).then(() => setLoading(false))


    }, [])

    useEffect(() => {
        let labels = document.querySelectorAll('#label')
        if (i18n.language === 'ar') {
            labels.forEach(label => label.setAttribute('class', 'rightBorder'))
        } else if (i18n.language === 'en') {
            labels.forEach(label => label.setAttribute('class', 'leftBorder'));
        }
    }, [searched, i18n.language])
    useEffect (()=>{
        setThirdCategory(x=>{return {...x, select: !!searched.grandchild_category_id}})
    },[searched.id])
    return (
        <>
            <h2>update product</h2>

            {searched?.id && <CForm onSubmit={e => submitHandler(e, searched.id)}>
                {loading ? <CSpinner /> :
                    <CRow xs={{ gutterY: 5 }}>
                        <CCol xs={12}>
                            <CRow className='justify-content-center'>
                                <CCol xs='auto' >
                                    <CFormLabel>{t('englishTitle')}*</CFormLabel>
                                    <CFormInput type="text" id="entitle" placeholder={t('englishTitle')} required defaultValue={searched.entitle} />
                                </CCol>
                                <CCol xs='auto'>
                                    <CFormLabel >{t('arabicTitle')}*</CFormLabel>
                                    <CFormInput type="text" id="artitle" placeholder={t('arabicTitle')} required defaultValue={searched.artitle} />
                                </CCol>
                                <CCol xs='auto'>
                                    <CFormLabel >{t('metaTitle')}</CFormLabel>
                                    < CFormInput type="text" id="metatitle" placeholder={t('metaTitle')} defaultValue={searched.metatitle ?? ''} />
                                </CCol>
                                <CCol xs='auto'>
                                    <CFormLabel >SKU</CFormLabel>
                                    < CFormInput type="text" id="sku" placeholder="SKU" defaultValue={searched.sku} />
                                </CCol>
                                <CCol xs='auto'>

                                    <CFormLabel >{t('price')}*</CFormLabel>
                                    < CFormInput type="number" id="price" placeholder={t('price')} step='0.01' required defaultValue={searched.price} />
                                </CCol>
                                <CCol xs='auto'>
                                    <CFormLabel >{t('brandName')}</CFormLabel>
                                    <CFormInput type="text" id="brandName" placeholder={t('brandName')} defaultValue={searched.brand_name ?? ''} />
                                </CCol>

                            </CRow>
                        </CCol>
                        <CCol xs={12} >
                            <CRow xs={{ gutter: 2 }} >
                                <CCol md={12} lg={6}>

                                    <CFormFloating>
                                        <CFormTextarea
                                            placeholder="Leave a comment here"
                                            id="endescription"
                                            style={{ height: '100px' }}
                                            defaultValue={searched.endescription}
                                            required
                                        ></CFormTextarea>
                                        <CFormLabel htmlFor="floatingTextarea2"  >{t('englishDescrition')}*</CFormLabel>
                                    </CFormFloating>
                                </CCol>
                                <CCol md={12} lg={6}>

                                    <CFormFloating>
                                        <CFormTextarea
                                            placeholder="Leave a comment here"
                                            id="ardescription"
                                            defaultValue={searched.ardescription}
                                            style={{ height: '100px' }}
                                            required
                                        ></CFormTextarea>
                                        <CFormLabel htmlFor="floatingTextarea3" >{t('arabicDescription')}*</CFormLabel>
                                    </CFormFloating>
                                </CCol>

                            </CRow>

                        </CCol>
                        <CCol lg={3} md={4} sm={6} xs={12}>
                            <CRow xs={{ gutter: 2 }}>
                                <CCol xs={12}>

                                    <CFormSelect aria-label="Default select example" required onChange={categoryVisibility} id='parentCategory' defaultValue={searched.parent_category_id} >
                                        {Children.toArray(parentCategories.map((val) => <option value={val.id} >{val.entitle}</option>))}
                                    </CFormSelect>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormSelect aria-label="Default select example" disabled={secondCategory.data.length === 0} onChange={categoryVisibility2} id='childCategory' defaultValue={searched.child_category_id}>

                                        {Children.toArray(secondCategory.data.map((val) => <option value={val.id} >{val.entitle}</option>))}
                                    </CFormSelect>

                                </CCol>
                                <CCol xs={12}>
                                    <CFormCheck id="flexCheckDefault" label='Select Third Category' onChange={e => setThirdCategory({ ...thirdCategory, select: e.target.checked })} checked={(thirdCategory.select)} disabled={thirdCategory.data.length ===0}/>
                                </CCol>

                                {thirdCategory.select && <CCol xs={12}>
                                    <CFormSelect aria-label="Default select example" id='grandChildCategory' disabled={thirdCategory.data.length === 0} defaultValue={searched.grandchild_category_id ?? ''}>
                                        <option value='default'>{t('grandChildCategory')}</option>
                                        {Children.toArray(thirdCategory.data.map((val) => <option value={val.id}>{val.entitle}</option>))}
                                    </CFormSelect>
                                </CCol>
                                }
                            </CRow>
                        </CCol>


                        {/* <section className="TCS" >
                            <section>
                            </section>
                            {(thirdCategory.selected) && <section style={{ width: '20%' }}>
                                <section>

                                </section>
                                <section>

                                </section>

                                {thirdCategory.select && <CFormSelect aria-label="Default select example" id='grandChildCategory' disabled={thirdCategory.data.length === 0} defaultValue={searched.grandchild_category_id ?? ''}>
                                    <option value='default'>{t('grandChildCategory')}</option>
                                    {Children.toArray(thirdCategory.data.map((val) => <option value={val.id}>{val.entitle}</option>))}
                                </CFormSelect>}


                                <CFormInput type={thirdCategory.add ? 'text' : 'hidden'} placeholder={t('addOwn')} className='thirdCategory' disabled={!thirdCategory.visible} id='addGrandChildCategory' />
                            </section>}


                        </section> */}
                        <CCol xs={12}>

                            <CButton type="submit" color="primary">
                                {t('submit')}
                            </CButton>
                        </CCol>

                    </CRow>
                }
            </CForm>
            }
        </>
    )
}

const mapDispatchToProps = { getSearchedProductHandler, updateProductHandler, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }
export default connect(null, mapDispatchToProps)(UpdateProduct)