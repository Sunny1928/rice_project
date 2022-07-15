import Api from '@/services/Api'

export default {
  index () {
    return Api().get('api/customers/allCustomers')
  },
  post (item) {
    return Api().post('api/customers/addCustomer', item)
  },
  put (item) {
    return Api().put(`api/customers/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`api/customers/${item.id}`)
  }
}