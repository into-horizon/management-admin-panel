import React, { useEffect} from 'react'
import { connect, useSelector,useDispatch } from 'react-redux'
import {
    DialogType,
    usePopup,
    ToastPosition,
  } from 'react-custom-popup';
import {resetState} from '../store/globalToasts'

export const Toaster = () => {
  const dispatch = useDispatch()
  const {status,message, type} = useSelector(state => state.globalToasts)
    const {  showToast } = usePopup();
        const messages = {create:'created successfully', update:'updated successfully', delete: 'deleted successfully', error: 'something went wrong'}
    const toastShow =  (toastType,message) => {
        showToast({
            text: message ?? messages[type],
            type: DialogType[toastType],
            position: ToastPosition.BOTTOM_RIGHT,
            timeoutDuration: 5000
          })
    }
    useEffect(()=>{
      const toastType = status === 200 ? 'INFO': 'DANGER';
      status && toastShow(toastType, message)
      dispatch(resetState())
    },[status])
    return <></>
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Toaster)