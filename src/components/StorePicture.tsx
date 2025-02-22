// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { CImage } from '@coreui/react'
// import { connect } from 'react-redux'
// import { useTranslation } from 'react-i18next';
// import { CButton, CSpinner } from '@coreui/react'
// import { updateStorePicture } from '../store/auth'
// import {If,Then,Else} from 'react-if'
// import { RootState } from '../store';

// type PropTypes ={
//     login: {}
//     updateStorePicture: (f:FormData) => Promise<void>
// }
// const StorePicture = (props:PropTypes) => {
//     const [type, setType] = useState('hidden')
//     const [text, setText] = useState('update')
//     const [loading, setLoading] = useState(false)

//     const { t } = useTranslation('translation', { keyPrefix: 'profile' });
//     const { login, updateStorePicture } = props

//     const changeHandler = (e : ChangeEvent<HTMLInputElement>) => {
//         setLoading(!loading)
//         let formData = new FormData();
//         e.target.files &&formData.append('image', e.target.files[0])
//         updateStorePicture(formData)
//         changeType()
//     }
//     useEffect(() => {
//         if(loading) {
//             setLoading(s => !loading)
//         }
//     }, [login.user.store_picture])

//     const changeType = () => {
//         setText(t => text === 'update' ? 'cancel' : 'update')
//         setType(t => type === 'hidden' ? 'file' : 'hidden')
//     }
//     return (
//         <>
//         <If condition={loading}>
//             <Then>
//                 <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "20%"}}>
//                 <CSpinner />

//                 </div>

//             </Then>
//             <Else>
//             <CImage rounded thumbnail src={login.user.store_picture} width={200} height={200} />

//             </Else>
//         </If>
//             <div className="storeImageUpdate">
//                 <CButton color="primary" onClick={changeType} >{t(`${text}`)}</CButton>
//                 <input type={type} id='imageInput' className="storeImage" onChange={changeHandler} accept="image/png,image/jpeg"  />

//             </div>
//         </>
//     )
// }

// const mapStateToProps = (state: RootState) => ({
//     login: state.login
// })

// const mapDispatchToProps = { updateStorePicture }

// export default connect(mapStateToProps, mapDispatchToProps)(StorePicture)

import React from 'react'

function StorePicture() {
  return <div>StorePicture</div>
}

export default StorePicture
