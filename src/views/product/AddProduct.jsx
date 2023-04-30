import React, { useState, useEffect, Children } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText, CAlert } from '@coreui/react'
import { If, Then, Else } from 'react-if'
import { useSelector, connect, useDispatch } from 'react-redux';
import { addProductHandler, errorMessage } from 'src/store/product';
import { usePopup, DialogType, AnimationType, ToastPosition } from "react-custom-popup";
import { useTranslation } from 'react-i18next';
import ColorSelector from 'src/components/ColorSelector';
import Colors from '../../services/colors'
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPlus,cilWarning } from '@coreui/icons';
import { getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler } from "src/store/category";


const AddProduct = ({ addProductHandler, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }) => {
    const {populatedStore} = useSelector(state=> state.stores)
    const dispatch = useDispatch()
    const { showOptionDialog, showToast, showAlert } = usePopup();
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const color = useTranslation('translation', { keyPrefix: 'colors' })
    const { parentCategories: { data: parentCategories }, childCategories: { data: childCategories }, grandChildCategories: { data: grandChildCategories } } = useSelector(state => state.category)
    const products = useSelector(state => state.products)


    let sizeSymbols = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers = []
    if (sizeNumbers.length === 0) {
        for (let i = 30; i <= 50; i++) {
            sizeNumbers.push(i)
        }

    }

    const initialState = {
        values: [],
        secondCategory: { visible: false, data: [] },
        thirdCategory: { visible: false, selected: false, add: false, select: true, data: [] },
        sizes: { visible: false, add: false },
        selectedSizes: [],
        sizesDetails: [],
        discount: { hasDiscount: false, discountRate: 0 },
        colorsAndSizes: { colorsOrSizes: false, colors: true, sizes: false, quantityDetails: [] }
    }
    const [values, setValues] = useState([])
    const [secondCategory, setSecondCategory] = useState( [] )
    const [thirdCategory, setThirdCategory] = useState([] )
    const [sizes, setSizes] = useState({ visible: false, add: false, data: [...sizeSymbols] })
    const [visibleGrandCateory, setVisibleGrandCategory] = useState(false)
    const [discount, setDiscount] = useState({ hasDiscount: false, discountRate: 0 })
    const [colorsAndSizes, setColorsAndSizes] = useState(initialState.colorsAndSizes)

useEffect(()=>{
    setSecondCategory(childCategories)
    childCategories[0] && getGrandChildCategoriesHandler({parent_id:childCategories[0].id})
},[childCategories])
useEffect(()=>{
     setThirdCategory(grandChildCategories)
},[grandChildCategories])

    const updateSizeColor = e => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.id === Number(e.target.id)) {
                return { ...val, color: e.target.value }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })

    }
    const updateSizeQuantity = e => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.id === Number(e.target.id)) {
                return { ...val, quantity: Number(e.target.value) }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })
    }

    const updateColorQuantity = e => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.color === e.target.id) {
                return { ...val, quantity: Number(e.target.value) }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })
    }
    const select = e => {
        let arr = colorsAndSizes.quantityDetails.map(x => x.size)
        let x = e.filter(value => !arr.includes(value.name))
        let y = x.map((x, i) => { return { id: colorsAndSizes.quantityDetails.length + 1, idx: colorsAndSizes.quantityDetails.length, size: x.name, color: colorsAndSizes.colors ? 'White' : null, quantity: 0 } })
        setColorsAndSizes(e => { return { ...colorsAndSizes, quantityDetails: [...colorsAndSizes.quantityDetails, ...y] } })
    }
    const selectColors = e => {
        let arr = colorsAndSizes.quantityDetails.map(x => x.color)
        let x = e.filter(value => !arr.includes(value.name))
        let y = x.map((x, i, array) => {
            return { id: colorsAndSizes.quantityDetails.length + 1, size: null, color: x.name, quantity: 0 }
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: [...colorsAndSizes.quantityDetails, ...y] })
    }
    const removeColors = e => {

        let y = colorsAndSizes.quantityDetails.filter(val => e.find(v => v.name === val.color))
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y })
    }
    const remove = e => {
        // let y =  colorsAndSizes.quantityDetails.filter( val => e.includes(val.size))
        let y = colorsAndSizes.quantityDetails.filter(val => !!e.filter(v => v.name === val.size)[0])
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y })
    }
    const addSizeColor = (size, idx) => {
        let newColor = { id: colorsAndSizes.quantityDetails.length + 1, idx: idx + 1, size: size, color: 'White', quantity: 0 }
        let arr = [...colorsAndSizes.quantityDetails]
        arr.splice(newColor.idx, 0, newColor)
        let final = arr.map((val, i) => { return { ...val, idx: i } })
        setColorsAndSizes(w => { return { ...colorsAndSizes, quantityDetails: final } })
    }
    const deleteSizeColor = id => {
        let newArr = colorsAndSizes.quantityDetails.filter(val => val.id !== id)
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newArr })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        // console.log("🚀 ~ file: AddProduct.jsx ~ line 117 ~ submitHandler ~ olorsAndSizes.quantityDetails.reduce((p, c) => p + Number(c.quantity), 0) ", colorsAndSizes.quantityDetails.reduce((p, c) => p + Number(c.quantity), 0) )
        let obj = {
            entitle: e.target.entitle.value,
            artitle: e.target.artitle.value,
            metatitle: e.target.metatitle.value,
            sku: e.target.sku.value,
            price: Number(e.target.price.value),
            brand_name: e.target.brandName.value,
            quantity: colorsAndSizes.quantityDetails.reduce((p, c) => p + Number(c.quantity), 0) || Number(e.target.quantity.value),
            endescription: e.target.endescription.value,
            ardescription: e.target.ardescription.value,
            parent_category_id: e.target.parentCategory.value,
            child_category_id: e.target.childCategory.value,
            grandchild_category_id: e.target.grandChildCategory?.value === '' ? null : (e.target.grandChildCategory?.value || null),
            size_and_color: colorsAndSizes.quantityDetails.length > 0 ? JSON.stringify(colorsAndSizes.quantityDetails) : null,
            discount: discount.hasDiscount,
            discount_rate: discount.discountRate,
            store_id: populatedStore.id
        }


        let formData = new FormData();
        if (e.target.image.files.length > 5) {
            return showAlert({

                type: DialogType.WARNING,
                text: t('imageLimitText'),
                title: t('imageLimit'),
                animationType: AnimationType.ZOOM_IN,
            })
        }
        if (obj.parent_category_id === '' || obj.child_category_id === '' || (obj.grandchild_category_id === '' )) {
            return showAlert({
                type: DialogType.WARNING,
                text: t('categoryText'),
                title: t('categoryTitle'),
                animationType: AnimationType.ZOOM_IN,
            })

        }
        for (let i = 0; i < e.target.image.files.length; i++) {
            formData.append('image', e.target.image.files[i], e.target.image.files[i].name)
        }
        Object.entries(obj).forEach(([key, value]) => {
            if (!value) {
                console.log('return ' ,key );
                return
            } else {
                formData.append(key, value)
            }
        }
        )
        addProductHandler(formData)

    }

    const categoryVisibility = e => {
       !!e.target.value &&getChildCategoriesHandler({ parent_id: e.target.value })
        setThirdCategory([])
        setVisibleGrandCategory(false)
    }
    const categoryVisibility2 = e => {
        !!e.target.value && getGrandChildCategoriesHandler({ parent_id: e.target.value })
    }

    const addSizes = e => {

        setValues(i => [...e.target.value.split(',')])
        if (e.target.value.includes(',')) {
        }

    }

    useEffect(() => {
        let labels = document.querySelectorAll('#label')
        if (i18n.language === 'ar') {
            labels.forEach(label => label.setAttribute('class', 'rightBorder'))
        } else if (i18n.language === 'en') {
            labels.forEach(label => label.setAttribute('class', 'leftBorder'));
        }

    }, [i18n.language])

    const resetSizes = () => {
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: [] })
    }
    useEffect(() => {

        console.log("🚀 ~ file: AddProduct.jsx ~ line 238 ~ colorsAndSizes", colorsAndSizes.quantityDetails)
    }, [colorsAndSizes])

    return (
        <>

            <h2>{t('add_product')}</h2>
            {/* <ColorSelector onChange={e => console.log(e.target.value)} /> */}
            <CAlert color='danger' visible={!populatedStore.id}>
                <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24}/>
                No Populated Store
            </CAlert>
            <CForm id='productForm' className="productForm mrgn50" onSubmit={submitHandler}>
                <CRow xs={{ gutterY: 3 }} className='justify-content-center'>

                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CFormLabel>{t('englishTitle')}*</CFormLabel>
                        <CFormInput type="text" id="entitle" placeholder={t('englishTitle')} required />
                    </CCol>
                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CCol>
                            <CFormLabel >{t('arabicTitle')}*</CFormLabel>

                        </CCol>
                        <CCol>
                            <CFormInput type="text" id="artitle" placeholder={t('arabicTitle')} required />

                        </CCol>
                    </CCol>
                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CCol>

                            <CFormLabel >{t('metaTitle')}</CFormLabel>
                        </CCol>
                        <CCol>
                            < CFormInput type="text" id="metatitle" placeholder={t('metaTitle')} />

                        </CCol>
                    </CCol>
                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CCol>
                            <CFormLabel >SKU</CFormLabel>

                        </CCol>
                        <CCol>

                            < CFormInput type="text" id="sku" placeholder="SKU" />
                        </CCol>
                    </CCol>
                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CCol>
                            <CFormLabel >{t('price')}*</CFormLabel>

                        </CCol>
                        <CCol>
                            < CFormInput type="number" className={`no${i18n.language}`} id="price" placeholder={t('price')} step='0.01' required />

                        </CCol>
                    </CCol>
                    <CCol xl={3} lg={4} sm={6} xs={12}>
                        <CCol>
                            <CFormLabel >{t('brandName')}</CFormLabel>

                        </CCol>
                        <CCol>
                            <CFormInput type="text" id="brandName" placeholder={t('brandName')} />

                        </CCol>
                    </CCol>
                    {!colorsAndSizes.colorsOrSizes && <CCol xs={12} >

                        <CRow className='justify-content-center'>
                            <CCol xs='auto'>

                                <CFormLabel>{t('quantity')}*</CFormLabel>
                            </CCol>

                        </CRow>
                        <CRow className='justify-content-center'>
                            <CCol xs='auto'>

                                <CFormInput type="number" id="quantity" className={`no${i18n.language}`} placeholder={t('quantity')} />
                            </CCol>

                        </CRow>
                        <CRow className='justify-content-center'>
                            <CCol xs='auto'>

                                <CFormLabel>{t('quantityLabel')}</CFormLabel>
                            </CCol>

                        </CRow>



                    </CCol>}

                    <CCol sm={12} md={6}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Leave a comment here"
                                id="endescription"
                                style={{ height: '100px' }}
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea2" required>{t('englishDescrition')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>
                    <CCol sm={12} md={6}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Leave a comment here"
                                id="ardescription"
                                style={{ height: '100px' }}
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea3" required>{t('arabicDescription')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>
                    <CCol lg={12}>
                        <CRow>
                            <CCol lg={4} md={6} sm={8} xs={12} xl={3}>

                                <CFormSelect required onChange={categoryVisibility} id='parentCategory'>
                                    <option value='' disabled={parentCategories.length >0}>{t('parentCategory')}</option>
                                    {Children.toArray(
                                        parentCategories.map((val) =>
                                            <option value={val.id}>{val[`${i18n.language}title`]}</option>
                                        )

                                    )}

                                </CFormSelect>
                                <CFormSelect disabled={secondCategory.length === 0} onChange={categoryVisibility2} id='childCategory'>
                                    <option value='' disabled={secondCategory.length >0}>{t('childCategory')}</option>

                                    {Children.toArray(
                                        secondCategory.map((val) =>
                                           <option value={val.id}>{val[`${i18n.language}title`]}</option>
                                       )

                                    )

                                    }
                                </CFormSelect>
                                {thirdCategory.length > 0 && <CFormCheck id='grandchildCheck' label='select third category' onChange={e=> setVisibleGrandCategory(e.target.checked)}/>}
                               {visibleGrandCateory && <CFormSelect disabled={thirdCategory.length === 0} id='grandchildCategory'>
                                    <option value=''>{t('grandChildCategory')}</option>
                                    {Children.toArray(
                                        thirdCategory.map((val) =>
                                            <option value={val.id} >{val[`${i18n.language}title`]}</option>
                                        )
                                    )
                                    }
                                </CFormSelect>}
                            </CCol>
                           </CRow>
                           
                  
                    </CCol>
                </CRow>

                <section className="TCS" >

                    <section>
                        <CFormCheck id="size" label={t('sizes')} onChange={e => setColorsAndSizes({ ...colorsAndSizes, colorsOrSizes: e.target.checked })} />
                    </section>
                    {colorsAndSizes.colorsOrSizes && <>
                        <section className="radioBtns">
                            <section>
                                <CFormCheck type="radio" name="sc" id="TC1" label='colors only' defaultChecked onChange={e => setColorsAndSizes({ ...colorsAndSizes, colors: e.target.checked, sizes: !e.target.checked, quantityDetails: [] })} />

                            </section>
                            <section>
                                <CFormCheck type="radio" name="sc" id="TC1" label='sizes only' onChange={e => setColorsAndSizes({ ...colorsAndSizes, colors: !e.target.checked, sizes: e.target.checked, quantityDetails: [] })} />

                            </section>
                            <section>
                                <CFormCheck type="radio" name="sc" id="TC1" label='sizes and colors' onChange={e => setColorsAndSizes({ ...colorsAndSizes, colors: e.target.checked, sizes: e.target.checked, quantityDetails: [] })} />

                            </section>
                        </section>
                        <section style={{ maxWidth: '20rem' }}>
                            {colorsAndSizes.colors && !colorsAndSizes.sizes && <Multiselect options={Colors.map((val, idx) => { return { name: color.t(val), id: idx + 1 } })}
                                onSelect={selectColors}
                                onRemove={removeColors}
                                selectedValues={e => console.log(e)}
                                displayValue="name"
                                placeholder={t('select')}
                            />}
                        </section>
                        {colorsAndSizes.sizes && <section className='radioBtns' style={{ width: '40%' }}>
                            <section>
                                <CFormCheck type="radio" name="s" id="TC1" label={t('symbolSizes')} defaultChecked onChange={() => { setSizes({ ...sizes, data: [...sizeSymbols], add: false }); resetSizes(); }} />

                            </section>

                            <section>

                                <CFormCheck type="radio" name="s" id="TC2" label={t('numericSizes')} onChange={() => { setSizes({ ...sizes, data: [...sizeNumbers], add: false }); resetSizes() }} />
                            </section>
                            <section>

                                <CFormCheck type="radio" name="s" id="TC2" label={t('addOther')} onChange={() => { setSizes({ ...sizes, add: true }); resetSizes() }} />
                            </section>
                            <If condition={!sizes.add}>
                                <Then>
                                    <Multiselect options={sizes.data.map((val, idx) => { return { name: val, id: idx + 1 } })}
                                        onSelect={select}
                                        onRemove={remove}
                                        selectedValues={e => console.log(e)}
                                        displayValue="name"
                                        placeholder={t('select')}
                                    />

                                </Then>
                                <Else>
                                    <CRow >
                                        {/* <CFormLabel htmlFor="validationServer05">{t('sizes')}</CFormLabel> */}
                                        <CFormInput type="text" id="sizesInput" placeholder={t('inserSizes')} required onChange={addSizes} />
                                        <CButton color="secondary" type="button" onClick={(e) => { select(values.map((val, idx) => { return { name: val, id: idx++ } })); document.getElementById('sizesInput').value = '' }} >
                                            {t('add')}
                                        </CButton>
                                    </CRow>
                                </Else>
                            </If>
                        </section>}
                        {colorsAndSizes.quantityDetails.length > 0 && <div className="sizesContainer" style={{ overflowY: 'scroll', maxHeight: '15rem', width: '30rem', maxWidth: '100%', padding: '1rem', border: '1px solid black', backgroundColor: '#fff', margin: '1rem 0' }}>
                            {colorsAndSizes.sizes && colorsAndSizes.quantityDetails.map((val, idx) =>
                                <div key={`size${idx}`} className="marginDiv sizesDiv"  >
                                    <h5 className="sizeHead">{val.size}: </h5>
                                    {colorsAndSizes.colors && <ColorSelector key={val['id']} id={val['id']} onChange={updateSizeColor} value={val.color} />}
                                    <input type="number" id={val['id']} key={`sizeQty${val['id']}`} placeholder={t('quantity')} onChange={updateSizeQuantity} className={`no${i18n.language}`} />
                                    {colorsAndSizes.sizes && colorsAndSizes.colors && <div>
                                        <CIcon icon={cilPlus} size="xl" className="pointer" title="add another color" onClick={() => addSizeColor(val.size, val.idx)} />
                                        <CIcon icon={cilTrash} size="xl" className="pointer" title="remove color" onClick={() => deleteSizeColor(val.id)} />
                                    </div>}
                                </div>
                            )

                            }

                            {colorsAndSizes.colors && !colorsAndSizes.sizes && colorsAndSizes.quantityDetails.map((val, idx) =>
                                <div key={`color${idx}`} className="marginDiv sizesDiv"   >
                                    <h5 className="sizeHead">{val.color}: </h5>
                                    <input type="number" id={val.color} key={`sizeQty${idx}`} placeholder={t('quantity')} onChange={updateColorQuantity} className={`no${i18n.language}`} />
                                </div>
                            )

                            }


                        </div>}

                    </>}
                    <section className="discountSection">
                        <section>

                            <CFormCheck id="discount" label={t('hasDiscount')} onChange={e => setDiscount({ ...discount, hasDiscount: e.target.checked })} />
                            <input type={discount.hasDiscount ? 'number' : 'hidden'} placeholder={t('insertDiscount')} className="discountRate" step="0.01" max="0.99" onChange={e => setDiscount({ ...discount, discountRate: Number(e.target.value) })} />
                        </section>

                        <label>{t('discountLabel')}</label>
                    </section>

                    <hr />
                    <CInputGroup className="mb-3 upload">
                        <section>
                            <CFormInput type="file" id="image" multiple="multiple" onChange={e => console.log(e.target.files[0])} accept="image/png,image/jpeg" />
                        </section>
                        <br />
                        <section>
                            <label>{t('uploadLabel')}</label>

                        </section>
                    </CInputGroup>

                    <label>- * {t('required')}</label>
                </section>
                <CButton type="submit" color="primary" disabled={!populatedStore.id}>
                    {t('submit')}
                </CButton>
            </CForm>
        </>

    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { addProductHandler, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);