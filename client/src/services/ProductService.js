import Api from '@/services/Api'

export default {
  index () {
    return Api().get('api/products/allProducts')
  },
  post (item) {
    return Api().post('api/products/addProduct', item)
  },
  put (item) {
    return Api().put(`api/products/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`api/products/${item.id}`)
  }
}