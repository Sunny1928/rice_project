<template>
  <v-container>
    <div class="white">
    <v-row>
      <v-col
        cols="12"
        md="1"
        class="pt-5">
        <b>篩選條件</b>
      </v-col>
      <v-col
        cols="12"
        md="3">
        <v-select
          v-model="searchCustomer"
          :items="customerNames"
          label="顧客選項選項"
          sort-by=""
          dense
          outlined
          solo>
        </v-select>
      </v-col>

      <v-col
        cols="12"
        md="1"
        class="pt-3">
        <v-btn
          class="d-flex"
          depressed
          :disabled = "searchCustomer == 'null'"
          :to="{
            name: 'trade',
            params: {
              customerName: searchCustomer
            }
          }"
          @click="this.initialize">
          搜尋
        </v-btn>
      </v-col>
    
      <v-col
        cols="12"
        md="3">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Picker in menu"
              prepend-icon="mdi-calendar"
              readonly
              dense
              outlined
              flat
              solo
              v-bind="attrs"
              v-on="on">
            </v-text-field>
          </template>
          <v-date-picker
            v-model="dates"
            no-title
            range>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="menu = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.menu.save(dates); filterTrades();">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>

      
    </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="trades"
      class="elevation-1"
      v-if="customerName!='null'">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{customerName}} 交易資料</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialog"
            max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on">
                新增交易
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                <v-switch
                  v-model="switch1"
                  inset
                  :label="`${(switch1 === true) ? '轉換到訂單模式' :'轉換到付款模式'}`"
                ></v-switch>
              </v-card-title>

              <v-card-text>
                <v-container v-if="!switch1">
                  <v-row>
                    <v-select
                      v-model="editedItem.name"
                      :items="productName"
                      label="商品選項"
                      :rules="[required]">
                    </v-select>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.amount"
                      label="數量">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.package"
                      label="包數">
                    </v-text-field>
                  </v-row>
                </v-container>

                <v-container v-else>
                  <v-row>
                    <v-select
                      v-model="editedItem.name"
                      :items="cashMethod"
                      label="入帳選項"
                      :rules="[required]">
                    </v-select>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.cash"
                      label="現金收款">
                    </v-text-field>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close">
                  取消
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                  :disabled="editedItem.name==''">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個交易嗎？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">確認</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="item.amount=='-'"
          dense
          class="mr-2"
          @click="addCashDate(item)">
          mdi-check-circle
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:no-data>
        <p class="ma-3">You haven't add any data.</p>
        <p class="ma-3">Or you can click reset button</p>
        <v-btn
          class="mb-3"
          color="primary"
          @click="initialize">
          Reset
        </v-btn>
      </template>

      <template
        v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))"
        v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>

    </v-data-table>
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
    dates: ['2022-7-10', '2022-7-18'],
    
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
      { text: '單價', value: 'price', sortable: false,
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
      this.customerNames = (await CustomerService.index()).data.map(value => value.name).sort()
      // customer name
      this.customerName = this.$store.state.route.params.customerName
      // console.log(this.customerName)

      // all products
      const products = (await ProductService.index()).data
      var productArr = []
      products.forEach(item=>{
        var fullName = item.name + item.number + item.uint
        this.productName.push(fullName)
        productArr[fullName] = item
      })
      // console.log(productArr)

      // all trade of customer
      this.allTrades = (await TradeService.index(this.customerName)).data
      // console.log(this.allTrades)

      // cashMethod selector
      this.cashMethod = (await CashMethodService.index()).data.map(value => value.name);

      // calculate part
      var sum = 0
      this.allTrades.forEach(item=>{
        item['date'] = item.createdAt.slice(0,10) + ' ' + item.createdAt.slice(11,19)
        
        if (item.amount == null){
          item['amount'] = '-'
          item['package'] = '-'
          item['sellUint'] = '-'
          item['price'] = '-'
          item['totalNumber'] = '-'
          item['aTradePrice'] = '-'
          sum-= item.cash
          item['grandPrice'] = sum
        }else{
          item['cash'] = '-'
          item['price'] = productArr[item.name].price
          item['sellUint'] = productArr[item.name].sellUint
          item['totalNumber'] = item.amount * item.package
          item['aTradePrice'] = item.totalNumber * item.price
          sum+= item.aTradePrice
          item['grandPrice'] = sum

        }

        // console.log(item)
      })

      this.filterTrades()
    },

    async addCashDate (item){
      item['cashDate'] = new Date()
      item['package'] = null
      item['amount'] = null

      try {
        await TradeService.put(item)
        this.initialize()
      } catch(err){
        console.log(err)
      } 
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

    async deleteItemConfirm () {
      try{
        await TradeService.delete(this.editedItem)
        this.trades.splice(this.editedIndex, 1)
        this.closeDelete()
      }catch(err){
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

    async save () {
      var item = this.editedItem
      item['customer_name'] = this.customerName
      item['user_name'] = this.$store.state.user.account
      // console.log(item['user_name'])

      if (this.switch1) {
        item['package'] = null
        item['amount'] = null
      }else{
        item['cash'] = null
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