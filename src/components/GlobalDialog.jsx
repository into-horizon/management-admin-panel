import React, { useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {
    DialogType,
    usePopup,
    AnimationType,
    OutAnimationType
  } from 'react-custom-popup';
import {resetState} from '../store/globalDialog'

export const GlobalDialog = () => {
  const dispatch = useDispatch()
  const {status,message, type, title} = useSelector(state => state.dialog)
    const {  showAlert } = usePopup();
        const messages = {create:'created successfully', update:'updated successfully', delete: 'deleted successfully', error: 'something went wrong'}
    const showDialog =  (title,message) => {
        showAlert({
            type: DialogType.DANGER,
            text: message,
            title: title,
            animationType: AnimationType.FADE_IN,
            outAnimationType: OutAnimationType.FADE_OUT,
          })
    }
    useEffect(()=>{
      const toastType = type === 'error' ? 'DANGER': 'INFO' ;
      message && showDialog(title?? 'Error', message?? 'something went wrong')
      dispatch(resetState())
    },[message])
    return <></>
}



export default GlobalDialog