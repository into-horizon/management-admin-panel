import React, { useState, useEffect, Children, ChangeEvent, FormEvent, useRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { CFormSelect, CFormLabel, CFormText, CFormCheck, CFormInput, CButton, CFormFloating, CFormTextarea, CFormFeedback, CCol, CForm, CRow, CInputGroup, CInputGroupText, CAlert } from '@coreui/react'
import { If, Then, Else } from 'react-if'
import { useSelector, connect, useDispatch } from 'react-redux';
import { addProductHandler } from 'src/store/product';
import { useTranslation } from 'react-i18next';
import ColorSelector from 'src/components/ColorSelector';
import Colors from '../../services/colors'
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPlus, cilWarning } from '@coreui/icons';
import { getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler } from "src/store/category";
import { RootState } from 'src/store';
import _ from 'lodash';
import { updateDialog } from 'src/store/globalDialog';
import { DialogResponseTypes } from 'src/enums';
import { ProductType, ParamsType, ChildAndGrandCategoriesType } from 'src/types';


type PropTypes = {
    addProductHandler : (p:ProductType| FormData) => Promise<void>,
    getChildCategoriesHandler : (p:ParamsType) => Promise<void>,
    getGrandChildCategoriesHandler : (p:ParamsType) => Promise<void>
}

const AddProduct = ({ addProductHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }:PropTypes) => {
    const { populatedStore } = useSelector((state: RootState) => state.stores)
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('translation', { keyPrefix: 'addProduct' });
    const color = useTranslation('translation', { keyPrefix: 'colors' })
    const { parentCategories: { data: parentCategories }, childCategories: { data: childCategories }, grandChildCategories: { data: grandChildCategories } } = useSelector((state: RootState) => state.category)

    const sizesInput = useRef<HTMLInputElement>(null)!
    let sizeSymbols: string[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    let sizeNumbers: number[] = _.range(30, 51)
    

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

    type QuantityDetailsType = {color: string | null, size: string | null, quantity: number, id: number | string,idx?:number }
    const [values, setValues] = useState<string[]>([])
    const [secondCategory, setSecondCategory] = useState<ChildAndGrandCategoriesType[]>([])
    const [thirdCategory, setThirdCategory] = useState<ChildAndGrandCategoriesType[]>([])
    const [sizes, setSizes] = useState<{visible: boolean, add:boolean, data: (string|number)[]}>({ visible: false, add: false, data: [...sizeSymbols] })
    const [visibleGrandCateory, setVisibleGrandCategory] = useState<boolean>(false)
    const [discount, setDiscount] = useState<{hasDiscount: boolean, discountRate: number}>({ hasDiscount: false, discountRate: 0 })
    const [colorsAndSizes, setColorsAndSizes] = useState<{colorsOrSizes: boolean,colors: boolean,sizes: boolean,quantityDetails:QuantityDetailsType[]  }>(initialState.colorsAndSizes)

    useEffect(() => {
        setSecondCategory(childCategories)
        childCategories[0] && getGrandChildCategoriesHandler({ parent_id: childCategories[0]?.id })
    }, [childCategories])
    useEffect(() => {
        setThirdCategory(grandChildCategories)
    }, [grandChildCategories])

    const updateSizeColor = (e: ChangeEvent<HTMLSelectElement>) => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.id === Number(e.target.id)) {
                return { ...val, color: e.target.value }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })

    }
    const updateSizeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.id === Number(e.target.id)) {
                return { ...val, quantity: Number(e.target.value) }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })
    }

    const updateColorQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        let newOne = colorsAndSizes.quantityDetails.map(val => {
            if (val.color === e.target.id) {
                return { ...val, quantity: Number(e.target.value) }
            } else return val
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne })
    }
    const select =( e :{name:string,id:number}[]) => {
        let arr = colorsAndSizes.quantityDetails.map(x => x.size)
        let x = e.filter(value => !arr.includes(value.name))
        let y = x.map((x, i) => { return { id: colorsAndSizes.quantityDetails.length + 1, idx: colorsAndSizes.quantityDetails.length, size: x.name, color: colorsAndSizes.colors ? 'White' : null, quantity: 0 } })
        setColorsAndSizes(e => { return { ...colorsAndSizes, quantityDetails: [...colorsAndSizes.quantityDetails, ...y] } })
    }
    const selectColors = ( e :{name:string,id:number}[]) => {
        let arr = colorsAndSizes.quantityDetails.map(x => x.color)
        let x = e.filter(value => !arr.includes(value.name))
        let y = x.map((x, i, array) => {
            return { id: colorsAndSizes.quantityDetails.length + 1, size: null, color: x.name, quantity: 0 }
        })
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: [...colorsAndSizes.quantityDetails, ...y] })
    }
    const removeColors = ( e :{name:string,id:number}[]) => {

        let y = colorsAndSizes.quantityDetails.filter(val => e.find(v => v.name === val.color))
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y })
    }
    const remove =( e :{name:string,id:number}[]) => {
        // let y =  colorsAndSizes.quantityDetails.filter( val => e.includes(val.size))
        let y = colorsAndSizes.quantityDetails.filter(val => !!e.filter(v => v.name === val.size)[0])
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y })
    }
    const addSizeColor = (size : string | null, idx: number| null ) => {
        let newColor = { id: colorsAndSizes.quantityDetails.length + 1, idx: (idx??0) + 1, size: size, color: 'White', quantity: 0 }
        let arr = [...colorsAndSizes.quantityDetails]
        arr.splice(newColor.idx, 0, newColor)
        let final = arr.map((val, i) => { return { ...val, idx: i } })
        setColorsAndSizes(w => { return { ...colorsAndSizes, quantityDetails: final } })
    }
    const deleteSizeColor = (id: number| null | string)  => {
        let newArr = colorsAndSizes.quantityDetails.filter(val => val.id !== id)
        setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newArr })
    }

    const submitHandler = (e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const target = e.target as typeof e.target &  { entitle: HTMLInputElement; artitle: HTMLInputElement; metatitle: HTMLInputElement; sku: HTMLInputElement; price: HTMLInputElement; brandName: HTMLInputElement; quantity?: HTMLInputElement; endescription: HTMLTextAreaElement; ardescription: HTMLTextAreaElement; parentCategory: HTMLSelectElement; childCategory: HTMLSelectElement; grandChildCategory?: HTMLSelectElement; image: { files: Blob[] };  }
        let obj = {
            entitle: target.entitle.value,
            artitle: target.artitle.value,
            metatitle: target.metatitle.value,
            sku: target.sku.value,
            price: Number(target.price.value),
            brand_name: target.brandName.value,
            quantity: colorsAndSizes.quantityDetails.reduce((p, c) => p + Number(c.quantity), 0) || Number(target.quantity?.value),
            endescription: target.endescription.value,
            ardescription: target.ardescription.value,
            parent_category_id: target.parentCategory.value,
            child_category_id: target.childCategory.value,
            grandchild_category_id: target.grandChildCategory?.value === '' ? null : (target.grandChildCategory?.value || null),
            size_and_color: colorsAndSizes.quantityDetails.length > 0 ? JSON.stringify(colorsAndSizes.quantityDetails) : null,
            discount: discount.hasDiscount,
            discount_rate: discount.discountRate,
            store_id: populatedStore.id
        }


        let formData = new FormData();
        if (target.image.files.length > 5) {
            dispatch(updateDialog({type: DialogResponseTypes.ERROR, message:t('imageLimitText') ,  title: t('imageLimit'),}))
            return 
        }
        if (obj.parent_category_id === '' || obj.child_category_id === '' || (obj.grandchild_category_id === '')) {
            dispatch(updateDialog({type: DialogResponseTypes.ERROR, message:t('categoryText') ,  title: t('categoryTitle')}))

            return 

        }
        for (let i = 0; i < target.image.files.length; i++) {
            formData.append('image', target.image.files[i], target.image.files[i].name)
        }
        Object.entries(obj).forEach(([key, value]) => {
            if (!value) {
                return
            } else {
                formData.append(key, value)
            }
        }
        )
        addProductHandler(formData)
    }

    const categoryVisibility = (e : ChangeEvent<HTMLSelectElement>) => {
        !!e.target.value && getChildCategoriesHandler({ parent_id: e.target.value })
        setThirdCategory([])
        setVisibleGrandCategory(false)
    }
    const categoryVisibility2 =(e : ChangeEvent<HTMLSelectElement>) => {
        !!e.target.value && getGrandChildCategoriesHandler({ parent_id: e.target.value })
    }

    const addSizes =( e: ChangeEvent<HTMLInputElement>) => {

        setValues(() => [...e.target.value.split(',')])
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
    

    return (
        <>

            <h2>{t('add_product')}</h2>
            {/* <ColorSelector onChange={e => console.log(e.target.value)} /> */}
            <CAlert color='danger' visible={!populatedStore.id}>
                <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
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
                                required
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea2" >{t('englishDescrition')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>
                    <CCol sm={12} md={6}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Leave a comment here"
                                id="ardescription"
                                style={{ height: '100px' }}
                                required
                            ></CFormTextarea>
                            <CFormLabel htmlFor="floatingTextarea3" >{t('arabicDescription')}*</CFormLabel>
                        </CFormFloating>
                    </CCol>
                    <CCol lg={12}>
                        <CRow>
                            <CCol lg={4} md={6} sm={8} xs={12} xl={3}>

                                <CFormSelect required onChange={categoryVisibility} id='parentCategory'>
                                    <option value='' disabled={parentCategories.length > 0}>{t('parentCategory')}</option>
                                    {Children.toArray(
                                        parentCategories.map((val) =>
                                            <option value={val.id}>{val.entitle}</option>
                                        )

                                    )}

                                </CFormSelect>
                                <CFormSelect disabled={secondCategory.length === 0} onChange={categoryVisibility2} id='childCategory'>
                                    <option value='' disabled={secondCategory.length > 0}>{t('childCategory')}</option>

                                    {Children.toArray(
                                        secondCategory.map((val) =>
                                            <option value={val.id}>{val.entitle}</option>
                                        )

                                    )

                                    }
                                </CFormSelect>
                                {thirdCategory.length > 0 && <CFormCheck id='grandchildCheck' label='select third category' onChange={e => setVisibleGrandCategory(e.target.checked)} />}
                                {visibleGrandCateory && <CFormSelect disabled={thirdCategory.length === 0} id='grandchildCategory'>
                                    <option value=''>{t('grandChildCategory')}</option>
                                    {Children.toArray(
                                        thirdCategory.map((val) =>
                                            <option value={val.id} >{val.entitle}</option>
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
                                        displayValue="name"
                                        placeholder={t('select')}
                                    />

                                </Then>
                                <Else>
                                    <CRow >
                                        <CFormInput type="text" id="sizesInput" ref={sizesInput} placeholder={t('inserSizes')} required onChange={addSizes} />
                                        <CButton color="secondary" type="button" onClick={(e) => { select(values.map((val, idx) => { return { name: val, id: idx++ } }));(sizesInput.current!.value = '') }} >
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
                                    {colorsAndSizes.colors && <ColorSelector key={val['id']} onChange={updateSizeColor} value={val.color ?? ''} selectStatement={false} />}
                                    <input type="number" id={String(val['id'])} key={`sizeQty${val['id']}`} placeholder={t('quantity')} onChange={updateSizeQuantity} className={`no${i18n.language}`} />
                                    {colorsAndSizes.sizes && colorsAndSizes.colors && <div>
                                        <CIcon icon={cilPlus} size="xl" className="pointer" title="add another color" onClick={() => addSizeColor(val.size, val.idx!)} />
                                        <CIcon icon={cilTrash} size="xl" className="pointer" title="remove color" onClick={() => deleteSizeColor(val.id!)} />
                                    </div>}
                                </div>
                            )

                            }

                            {colorsAndSizes.colors && !colorsAndSizes.sizes && colorsAndSizes.quantityDetails.map((val, idx) =>
                                <div key={`color${idx}`} className="marginDiv sizesDiv"   >
                                    <h5 className="sizeHead">{val.color}: </h5>
                                    <input type="number" id={val.color!} key={`sizeQty${idx}`} placeholder={t('quantity')} onChange={updateColorQuantity} className={`no${i18n.language}`} />
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
                            <CFormInput type="file" id="image" multiple accept="image/png,image/jpeg" />
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



const mapDispatchToProps = { addProductHandler, getParentCategoriesHandler, getChildCategoriesHandler, getGrandChildCategoriesHandler }
export default connect(null, mapDispatchToProps)(AddProduct);