import { FC, useEffect, useState } from 'react'
import SearchDropdown, {
  OptionType,
} from '../../../../components/SearchDropdown'
import configurationTypesService from '../../../../services/ConfigurationTypes.service'
import { ConfigurationType } from '../../../../types'

type PropTypes = {
  onSelect: (d: (OptionType & ConfigurationType) | null) => void
  invalid?: boolean
  feedbackInvalid?: string
  disabled?: boolean
}
const ConfigurationTypeAutocomplete: FC<PropTypes> = ({
  onSelect,
  invalid,
  feedbackInvalid,
  disabled,
}) => {
  const [data, setData] = useState<ConfigurationType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedValue, setSelectedValue] = useState<{
    title: string
    id: string
  } | null>(null)
  const onSelectHandler = (d: (OptionType & ConfigurationType) | null) => {
    setSelectedValue(d)
    onSelect(d)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await configurationTypesService.getConfigurationTypes({
          limit: 50,
          search: searchTerm,
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
      options={data.map((item) => ({
        title: item.displayName!,
        ...item,
      }))}
      onChange={(e) => setSearchTerm(e)}
      onSelect={(d) => onSelectHandler(d as OptionType & ConfigurationType)}
      loading={loading}
      placeholder='Select Configuration Type'
      selectedValue={selectedValue}
      invalid={invalid}
      feedbackInvalid={feedbackInvalid}
      disabled={disabled}
    />
  )
}

export default ConfigurationTypeAutocomplete
