import { FC, useEffect, useState } from 'react'
import SearchDropdown from '../../../../components/SearchDropdown'
import configurationTypesService from '../../../../services/ConfigurationTypes.service'
import { ConfigurationType } from '../../../../types'

type PropTypes = {
  onSelect: (d: { title: string; id: string } | null) => void
}
const ConfigurationTypeAutocomplete: FC<PropTypes> = ({ onSelect }) => {
  const [data, setData] = useState<ConfigurationType[]>([])
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
        const response = await configurationTypesService.getConfigurationTypes({
          limit: 50,
          displayName: searchTerm,
        })
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
      options={data.map((item) => ({ id: item.id, title: item.displayName! }))}
      onChange={(e) => setSearchTerm(e)}
      onSelect={onSelectHandler}
      loading={loading}
      placeholder='Select Configuration Type'
      selectedValue={selectedValue}
    />
  )
}

export default ConfigurationTypeAutocomplete
