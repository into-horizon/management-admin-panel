import React from 'react'
import DisplayObject from '../../components/DisplayObject'

import { ColumnType } from '../../components/Table'
import { isValidJSON } from '../../services/helpers'
import { RequestLog } from '../../types'
import ResponseModal from './components/ResponseModal'

export const columns: ColumnType[] = [
  {
    header: 'method',
    field: 'method',
  },
  {
    header: 'url',
    field: 'url',
  },
  {
    header: 'status',
    field: 'status',
  },
  {
    header: 'user',
    field: 'user',
    body: (row: RequestLog) => {
      if (row.employee) {
        return ` ${row.employee.first_name} ${row.employee.last_name} as Employee`
      }
      if (row.profile) {
        return `User ${row.profile.first_name} ${row.profile.last_name} as User`
      }
    },
  },
  {
    header: 'query',
    field: 'query',
    body: (row: RequestLog) => row?.query && <DisplayObject data={row?.query} />,
  },
  {
    header: 'request body',
    field: 'request_body',
    body: (row: RequestLog) =>
      isValidJSON(row?.request_body) && <DisplayObject data={JSON.parse(row?.request_body)} />,
  },
  {
    header: 'response body',
    field: 'response_body',
    body: (row: RequestLog) => <ResponseModal {...row} />,
  },
  {
    header: 'created at',
    field: 'created_at',
    body: (row: RequestLog) => new Date(row.created_at).toLocaleString(),
  },
]
