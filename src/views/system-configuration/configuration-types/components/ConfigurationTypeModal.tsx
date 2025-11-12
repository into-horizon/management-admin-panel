import React, { useReducer, useState } from 'react'
import {
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
} from '@coreui/react'
import { CButtonProps } from '@coreui/react/dist/components/button/CButton'
import { useDispatch } from 'react-redux'
import {
  createConfigurationType,
  setConfigurationTypesModalVisible,
} from '../../../../store/configurationTypes.slice'
import { useSelectorWithType } from '../../../../store'
import { PostConfigurationType } from '../../../../types'
import { stat } from 'fs'
import { PayloadAction } from '@reduxjs/toolkit'

const ConfigurationTypeModal = ({
  triggerButton: TriggerButton,
}: {
  triggerButton: React.FC<CButtonProps>
}) => {
  const dispatch = useDispatch()
  const { isModalVisible } = useSelectorWithType(
    (state) => state.configureTypes
  )

  const [formState, stateDispatch] = useReducer(
    (
      state: { name: string; displayName: string },
      action: PayloadAction<string>
    ) => {
      switch (action.type) {
        case 'SET_NAME':
          return { ...state, name: action.payload }
        case 'SET_DISPLAY_NAME':
          return { ...state, displayName: action.payload }
        case 'RESET':
          return { name: '', displayName: '' }
        default:
          return state
      }
    },
    { name: '', displayName: '' }
  )

  const toggleModal = (isVisible: boolean) => {
    dispatch(setConfigurationTypesModalVisible(isVisible))
    if (!isVisible) {
      stateDispatch({ type: 'RESET', payload: '' })
    }
  }
  const onSave = () => {
    dispatch(createConfigurationType(formState as PostConfigurationType))
    stateDispatch({ type: 'RESET', payload: '' })
  }

  return (
    <>
      <TriggerButton onClick={() => toggleModal(true)} />
      <CModal
        visible={isModalVisible}
        onClose={() => toggleModal(false)}
        alignment='center'
      >
        <CModalHeader>
          <CModalTitle>Configuration Type</CModalTitle>
        </CModalHeader>
        <CModalBody className='d-flex gap-3'>
          <CFormInput
            placeholder='Name'
            value={formState.name}
            onChange={(e) =>
              stateDispatch({ type: 'SET_NAME', payload: e.target.value })
            }
          />
          <CFormInput
            placeholder='Display Name'
            value={formState.displayName}
            onChange={(e) =>
              stateDispatch({
                type: 'SET_DISPLAY_NAME',
                payload: e.target.value,
              })
            }
          />
        </CModalBody>
        <CModalFooter>
          <CButton color='secondary' onClick={() => toggleModal(false)}>
            Close
          </CButton>
          <CButton color='primary' onClick={onSave}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default ConfigurationTypeModal
