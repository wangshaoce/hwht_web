import table_order_info from '@/utils/tableinfo'

export function getList(data) {
  return table_order_info({
    url: '/mobile/key_query',
    method: 'post',
    data
  })
}
