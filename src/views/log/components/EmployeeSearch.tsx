import React, { useState } from 'react'
import SearchDropdown, { OptionType } from '../../../components/SearchDropdown'
import Employee from '../../../services/Employee'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { updateParams } from '../../../store/log'

const EmployeeSearch = () => {
  const [employees, setEmployees] = useState<OptionType[]>([])
  const [employee, setEmployee] = useState<OptionType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { params } = useSelector((state: RootState) => state.log)
  const dispatch = useDispatch()

  const onEmployeeSearch = async (e: string) => {
    try {
      setIsLoading(true)
      const { data } = await Employee.getEmployees({ limit: 10, offset: 0, key: e })
      setEmployees(data.data.map((e) => ({ title: e.name!, id: e.id! })))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <SearchDropdown
      options={employees}
      onChange={onEmployeeSearch}
      onSelect={(e) => {
        dispatch(updateParams({ ...params, employee_id: e?.id! }))
        setEmployee(e)
      }}
      delay={1000}
      placeholder='employees'
      selectedValue={employee}
      loading={isLoading}
    />
  )
}
export default EmployeeSearch
