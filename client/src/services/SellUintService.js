import Api from '@/services/Api'

export default {
  index () {
    return Api().get('api/sellUints/allSellUints')
  },
  post (item) {
    return Api().post('api/sellUints/addSellUint', item)
  },
  put (item) {
    return Api().put(`api/sellUints/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`api/sellUints/${item.id}`)
  }
}