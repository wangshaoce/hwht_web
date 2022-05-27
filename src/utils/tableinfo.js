import axios from 'axios'
const table_order_info = axios.create({
  baseURL: 'http://118.195.236.81:5000',
  method: 'post',
  data: {}
})
export default table_order_info
