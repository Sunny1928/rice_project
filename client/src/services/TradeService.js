import Api from '@/services/Api'

export default {
  index (customer) {
    return Api().get(`api/trades/allTrades/${customer}`)
  },
  post (item) {
    return Api().post('api/trades/addTrade', item)
  },
  put (item) {
    return Api().put(`api/trades/${item.id}`, item)
  },
  delete (item) {
    return Api().delete(`api/trades/${item.id}`)
  }
}