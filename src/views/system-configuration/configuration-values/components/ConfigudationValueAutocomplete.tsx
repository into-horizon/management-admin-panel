import { FC, useEffect, useState } from 'react'
import SearchDropdown from '../../../../components/SearchDropdown'
import { ConfigurationValueType } from '../../../../types'
import configurationValueService from '../../../../services/ConfigurationValue.service'

type PropTypes = {
  onSelect: (d: { title: string; id: string } | null) => void
}
const ConfigurationValueAutocomplete: FC<PropTypes> = ({ onSelect }) => {
  const [data, setData] = useState<ConfigurationValueType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedValue, setSelectedValue] = useState<{
    title: string
    id: string
  } | null>(null)

  const onSelectHandler = (d: { title: string; id: string } | null) => {
    setSelectedValue(d)
    onSelect(d)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await configurationValueService.getConfigurationValues(
          { limit: 50, displayName: searchTerm }
        )
        setData(response.data)
      } catch (error) {
        console.error('Error fetching configuration types:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchTerm])

  return (
    <SearchDropdown
      options={data.map((item) => ({
        id: item.id!,
        title: `${item.valueEn} - ${item.valueAr}`,
      }))}
      onChange={(e) => setSearchTerm(e)}
      onSelect={onSelectHandler}
      loading={loading}
      placeholder='Select Configuration Type'
      selectedValue={selectedValue}
    />
  )
}

export default ConfigurationValueAutocomplete
