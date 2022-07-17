import Api from '@/services/Api'

export default {
  index () {
    return Api().get('api/cashMethods/allcashMethods')
  },
  post (item) {
    return Api().post('api/cashMethods/addcashMethod', item)
  },
  put (item) {
    return Api().put(`api/cashMethods/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`api/cashMethods/${item.id}`)
  }
}