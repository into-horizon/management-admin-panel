import { FC, useEffect, useState } from 'react'
import SearchDropdown, {
  OptionType,
} from '../../../../components/SearchDropdown'
import { ConfigurationValueType } from '../../../../types'
import configurationValueService from '../../../../services/ConfigurationValue.service'

type PropTypes = {
  onSelect: (d: (OptionType & ConfigurationValueType) | null) => void
  invalid?: boolean
  feedbackInvalid?: string
}
const ConfigurationValueAutocomplete: FC<PropTypes> = ({
  onSelect,
  invalid,
  feedbackInvalid,
}) => {
  const [data, setData] = useState<ConfigurationValueType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedValue, setSelectedValue] = useState<{
    title: string
    id: string
  } | null>(null)

  const onSelectHandler = (d: (OptionType & ConfigurationValueType) | null) => {
    setSelectedValue(d)
    onSelect(d)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await configurationValueService.getConfigurationValues(
          { limit: 50, search: searchTerm }
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
        title: `${item.valueEn} - ${item.valueAr}`,
        ...item,
      }))}
      onChange={(e) => setSearchTerm(e)}
      onSelect={(d) =>
        onSelectHandler(d as OptionType & ConfigurationValueType)
      }
      loading={loading}
      placeholder='Select parent'
      selectedValue={selectedValue}
      invalid={invalid}
      feedbackInvalid={feedbackInvalid}
    />
  )
}

export default ConfigurationValueAutocomplete
