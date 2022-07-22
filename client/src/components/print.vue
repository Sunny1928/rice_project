<template>
  <v-container>
    {{$route.data}}
  </v-container>
</template>

<script>
import ProductService from '@/services/ProductService'
import TradeService from '@/services/TradeService'
import CashMethodService from '@/services/CashMethodService'
import CustomerService from '@/services/CustomerService'


export default {
  data: () => ({
    // dates: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
    dates: ['2022-7-10', '2022-7-30'],
    
    menu: false,

    searchCustomer:'null',
    customerNames: [],
    switch1: false,
    cashMethod: [],
    productName: [],
    customerName: '',
    required: (value) => value.toString().length !== 0 || 'Required.',
    dialog: false,
    dialogDelete: false,
    dialogCashTime: false,
    currentTime: '',
    headers: [
      { text: '日期', value: 'date', sortable: false, width: '10%'},
      {
        text: '產品',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '數量', value: 'amount', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '包數', value: 'package', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '總數量', value: 'totalNumber', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '單位', value: 'sellUint', sortable: false},
      { text: '單價', value: 'uintPrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '小計', value: 'aTradePrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '現金收款', value: 'cash', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '現金收款日期', value: 'cashDate', sortable: false, width: '10%'},
      { text: '累計', value: 'grandPrice', sortable: false, 
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '功能', value: 'actions', sortable: false, width: '10%'},
    ],
    productArr: [],
    trades: [],
    allTrades: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      amount: '',
      package: '',
      cash: 0
    },
    defaultItem: {
      name: '',
      amount: '',
      package: '',
      cash: 0
    },
  }),

  async mounted () {
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增交易' : '編輯交易'
    },
    dateRangeText () {
      if(new Date(this.dates[0])> new Date(this.dates[1])){
        var tempDate = this.dates[1]
        this.dates[1] = this.dates[0]
        this.dates[0] = tempDate
      }
      return this.dates.join(' ~ ')
    },
  },

  watch: {
    dialog (val) {
      this.switch1 = this.editedItem.amount=='-'? true : false
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogCashTime (val){
      val || this.closeCashTime()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    filterTrades (){
      var startDate = new Date(this.dates[0]);
      var endDate = new Date(this.dates[1]);

      this.trades = this.allTrades.filter(function (product) {
        var date = new Date(product.createdAt);
        return (date >= new Date(startDate) && date <= new Date(new Date(endDate).valueOf() + 1000*3600*24));
      });
      // console.log(this.trades)
    },

    numberWithCommas (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },

    async initialize () {
      // all customer names
      this.customerNames = (await CustomerService.index()).data.map(value => value.name).sort()
      
      // customer name
      this.customerName = this.$store.state.route.params.customerName
      // console.log(this.customerName)

      // get all products
      const products = (await ProductService.index()).data
      this.productArr = []
      products.forEach(item=>{
        var fullName = item.name + item.number + item.uint
        this.productName.push(fullName)
        this.productArr[fullName] = item
      })
      // console.log(this.productArr)

      // all trade of customer
      this.allTrades = (await TradeService.index(this.customerName)).data
      // console.log(this.allTrades)

      // cashMethod selector
      this.cashMethod = (await CashMethodService.index()).data.map(value => value.name);

      // calculate sum part
      var sum = 0
      this.allTrades.forEach(item=>{
        item['date'] = item.createdAt.slice(0,10) + ' ' + item.createdAt.slice(11,19)
        
        if (item.amount == null){
          item['amount'] = '-'
          item['package'] = '-'
          item['sellUint'] = '-'
          item['uintPrice'] = '-'
          item['totalNumber'] = '-'
          item['aTradePrice'] = '-'
          if(!item.cashDate){
            item['cashDate'] = '未收款'
          }
          sum-= item.cash
          item['grandPrice'] = sum
        }else{
          item['cash'] = '-'
          item['cashDate'] = '-'

          sum+= item.aTradePrice
          item['grandPrice'] = sum

        }

        // console.log(item)
      })

      this.filterTrades()
    },

    editItem (item) {
      this.editedIndex = this.trades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.trades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    addCashDate (item){
      this.editedIndex = this.trades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogCashTime = true
      this.currentTime = new Date()
    },

    async deleteItemConfirm () {
      try{
        await TradeService.delete(this.editedItem)
        this.trades.splice(this.editedIndex, 1)
        this.closeDelete()
      }catch(err){
        console.log(err)
      }
    },

    async CashTimeItemConfirm () {
      this.editedItem['cashDate'] = this.currentTime
      this.editedItem['package'] = null
      this.editedItem['amount'] = null
      this.editedItem['totalNumber'] = null
      this.editedItem['sellUint'] = null
      this.editedItem['uintPrice'] = null
      this.editedItem['aTradePrice'] = null

      try {
        await TradeService.put(this.editedItem)
        this.closeCashTime()
        this.initialize()
      } catch(err){
        console.log(err)
      } 
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeCashTime () {
      this.dialogCashTime = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      var item = this.editedItem
      item['customer_name'] = this.customerName
      item['user_name'] = this.$store.state.user.account
      // console.log(item['user_name'])

      if (this.switch1) {
        item['package'] = null
        item['amount'] = null
        item['totalNumber'] = null
        item['sellUint'] = null
        item['uintPrice'] = null
        item['aTradePrice'] = null
      }else{
        item['totalNumber'] = item.amount * item.package
        item['sellUint'] = this.productArr[item.name].sellUint
        item['uintPrice'] = this.productArr[item.name].price
        item['aTradePrice'] = item.totalNumber * item.uintPrice
        item['cash'] = null
        item['cashDate'] = null
      }

      if (this.editedIndex > -1) {
        // console.log('edit')
        try{
          await TradeService.put(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      } else {
        // console.log('new')
        try{
          await TradeService.post(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      }
      this.close()
    },
  },
}
</script>

<style scoped>
.border{
  border: 2px solid cyan;
}
</style>