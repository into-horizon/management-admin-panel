import React, { useState } from 'react'
import SearchDropdown, { OptionType } from '../../../components/SearchDropdown'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { updateParams } from '../../../store/log'
import User from '../../../services/User'
const UserSearch = () => {
  const [users, setUsers] = useState<OptionType[]>([])
  const [user, setUser] = useState<OptionType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { params } = useSelector((state: RootState) => state.log)
  const dispatch = useDispatch()

  const onUserSearch = async (e: string) => {
    try {
      setIsLoading(true)
      const { data } = await User.getUsers({ limit: 10, offset: 0, query: e })
      setUsers(
        data.map((e) => ({
          title: `${e.profile.first_name} ${e.profile.last_name}`,
          id: e.profile.id,
        })),
      )
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <SearchDropdown
      options={users}
      onChange={onUserSearch}
      onSelect={(e) => {
        dispatch(updateParams({ ...params, profile_id: e?.id! }))
        setUser(e)
      }}
      delay={1000}
      placeholder='users'
      selectedValue={user}
      loading={isLoading}
    />
  )
}
export default UserSearch
