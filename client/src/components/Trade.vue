<template >
  <v-container v-if="!$store.state.isPrint">
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
    <div v-if="customerName=='null'">
      Choose a customer above
    </div>
    <v-data-table
      :headers="headers"
      :items="trades"
      class="elevation-1"
      v-else>

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
                class="mb-2"
                @click="openEnvelop">
                列印信封
              </v-btn>

              <v-btn
                class="mb-2 mr-2"
                @click="openMonthReceipt">
                列印流水帳
              </v-btn>

              <v-btn
                class="mb-2 mr-2"
                @click="openDayReceipt">
                列印出貨單
              </v-btn>

              <v-btn
                color="primary"
                class="mb-2 mr-2"
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

          <v-dialog v-model="dialogCashTime" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">付款時間為 {{currentTime.toLocaleString()}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeCashTime">取消</v-btn>
                <v-btn color="blue darken-1" text @click="CashTimeItemConfirm">確認</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon
          v-if="item.amount=='-'"
          dense
          @click="addCashDate(item)">
          mdi-check-circle
        </v-icon>
      </template>

      <template v-slot:no-data>
        <p class="ma-3">You haven't add any data</p>
        <p class="ma-3">If you add, click the reset button</p>
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

  <v-container v-else class="receipt">
    <div v-if="printSelect==1" style="width: 812px;background-color: antiquewhite;height: 529px; padding: 5px; overflow: hidden;">
      <div style="text-align: center;">
          <h3>出  貨  單</h3>
          <p>年昌碾米工廠 地址: 玉里中華路28號</p>
          <p>電話: (038)882066 (038)883066 傳真: (038)881066</p>
      </div>
      <div style="display:flex;">
        <div style="width: 70%;text-align: left;">
            <p>廠商編號： {{customerInfo.taxId}}</p>
            <p>廠商姓名： {{customerInfo.name}}</p>
            <p>廠商地址： {{customerInfo.address}}</p>
        </div>
        <div style="width: 30%;text-align: left;">
            <p>廠商電話： {{customerInfo.homePhone}}</p>
            <p>日期： {{dates[0]}}</p>
        </div>
      </div>
      <div style="margin-top: 5px;width:100%;">
          <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
              <p style="width:5%; text-align:center;">NO</p>
              <p style="width:15%;text-align:start;">出貨品名</p>
              <p style="width:10%;text-align:end;">數量</p>
              <p style="width:10%;text-align:end;">包數</p>
              <p style="width:12%;text-align:end;">總數量</p>
              <p style="width:5%; text-align:end;">單位</p>
              <p style="width:12%;text-align:end;">單價</p>
              <p style="width:15%;text-align:end;">貸款</p>
              <p style="width:16%;text-align:center;">備註</p>
          </div>
          
          
          <div style="display: flex;" v-for="(item, index) in trades">
              <p style="width:5%;  text-align: center;">{{index+1}}</p>
              <p style="width:15%; text-align: start;">{{item.name}}</p>
              <p style="width:10%; text-align: end;">{{item.amount}}</p>
              <p style="width:10%; text-align: end;">{{item.package}}</p>
              <p style="width:12%; text-align: end;">{{item.totalNumber}}</p>
              <p style="width:5%;  text-align: end;">{{item.sellUint}}</p>
              <p style="width:12%; text-align: end;">{{item.uintPrice}}</p>
              <p style="width:15%; text-align: end;">{{item.aTradePrice}}</p>
              <p style="width:16%; text-align: end;"></p>
          </div>
          

          <div style="width: 99%; display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; margin-top: 20px;padding-left: 10px;">
              <p style="width:25%;text-align:start;">本次銷售：{{this.daySum}}元</p>
              <p style="width:25%;text-align:start;">前次累積：</p>
              <p style="width:25%;text-align:start;">貸款總計：</p>
              <p style="width:25%;text-align:start;">總重量：{{this.dayWeight}}公斤</p>
          </div>
      </div>
    </div>

    <div v-if="printSelect==2" style="width: 812px;background-color: antiquewhite;height: 529px; padding: 5px; overflow: hidden;">
      <div style="text-align: center;">
          <h3>出  貨  單</h3>
          <p>年昌碾米工廠 地址: 玉里中華路28號</p>
          <p>電話: (038)882066 (038)883066 傳真: (038)881066</p>
      </div>
      <div style="display:flex;">
        <div style="width: 70%;text-align: left;">
            <p>廠商編號： {{customerInfo.taxId}}</p>
            <p>廠商姓名： {{customerInfo.name}}</p>
            <p>廠商地址： {{customerInfo.address}}</p>
        </div>
        <div style="width: 30%;text-align: left;">
            <p>廠商電話： {{customerInfo.homePhone}}</p>
            <p>日期： {{dates[0]}}</p>
        </div>
      </div>
      <div style="margin-top: 5px;width:100%;">
          <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
              <p style="width:12%; text-align:center;">日期</p>
              <p style="width:15%;text-align:start;">品名</p>
              <p style="width:10%;text-align:end;">數量</p>
              <p style="width:5%; text-align:end;">單位</p>
              <p style="width:12%;text-align:end;">單價</p>
              <p style="width:15%;text-align:end;">小計</p>
              <p style="width:15%;text-align:end;">累計</p>
              <p style="width:16%;text-align:center;">備註</p>
          </div>
          
          
          <div style="display: flex;" v-for="(item, index) in trades">
              <p style="width:12%; text-align: center;">{{item.createdAt.slice(0,10)}}</p>
              <p style="width:15%; text-align: start;">{{item.name}}</p>
              <p style="width:10%; text-align: end;">{{item.totalNumber}}</p>
              <p style="width:5%;  text-align: end;">{{item.sellUint}}</p>
              <p style="width:12%; text-align: end;">{{item.uintPrice}}</p>
              <p v-if="item.totalNumber != '-'" style="width:15%; text-align: end;">{{item.aTradePrice}}</p>
              <p v-if="item.totalNumber == '-'" style="width:15%; text-align: end;">{{item.cash}}</p>

              <p style="width:15%; text-align: end;">{{item.aTradePrice}}</p>
              <p style="width:16%; text-align: end;">{{item.cashDate.slice(0,10)}}</p>
          </div>
          

          <div style="width: 99%; display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; margin-top: 20px;padding-left: 10px;">
              <p style="width:25%;text-align:start;">本次銷售：{{this.daySum}}元</p>
              <p style="width:25%;text-align:start;">前次累積：</p>
              <p style="width:25%;text-align:start;">貸款總計：</p>
              <p style="width:25%;text-align:start;">總重量：{{this.dayWeight}}公斤</p>
          </div>
      </div>
    </div>

    <div v-if="printSelect==3" style="position:relative; height: 831.6px; width: 378px; background-color: antiquewhite; font-size: 20px;text-align: start;">
        <div style="position: absolute; top: 200px; right: 30px;writing-mode: vertical-rl;text-orientation: mixed;">
            <p>(2022-7-20)</p>
            <p>電話：{{this.customerInfo.homePhone}}</p>
            <p>{{this.customerInfo.address}}</p>
        </div>
        <div style="position: absolute; top: 150px; right: 180px;writing-mode: vertical-rl;text-orientation: mixed; font-size: 24px;">
            <p>{{this.customerInfo.name}} 收</p>
        </div>
    </div>
    <v-btn @click="closeDayReceipt">ok</v-btn>
</v-container>
</template>



<script>
import ProductService from '@/services/ProductService'
import TradeService from '@/services/TradeService'
import CashMethodService from '@/services/CashMethodService'
import CustomerService from '@/services/CustomerService'


export default {
  data: () => ({
    printSelect: 0,
    daySum: 0,
    dayWeight: 0,

    // dates: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
    dates: ['2022-7-10', '2022-7-30'],
    
    menu: false,

    searchCustomer:'null',
    switch1: false,
    cashMethod: [],
    productName: [],
    customerNames: [],
    customerName: '',
    customerInfo:{},
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
    openEnvelop(){
      this.printSelect = 3
      this.$store.commit('setPrint')
    },

    closeEnvelop(){
      this.printSelect = 0
      this.$store.commit('setPrint')
    },

    openMonthReceipt(){
      this.printSelect = 2
      this.trades.forEach(item=>{
        this.daySum += item.aTradePrice

        if(item.totalNumber == '-') return
        else if(this.productArr[item.name].uint == '台斤') this.dayWeight += this.productArr[item.name].number*0.6*item.totalNumber
        else this.dayWeight += this.productArr[item.name].number*item.totalNumber
      })
      this.$store.commit('setPrint')
    },

    openDayReceipt(){
      this.printSelect = 1
      this.trades.forEach(item=>{
        this.daySum += item.aTradePrice

        if(item.totalNumber == '-') return
        else if(this.productArr[item.name].uint == '台斤') this.dayWeight += this.productArr[item.name].number*0.6*item.totalNumber
        else this.dayWeight += this.productArr[item.name].number*item.totalNumber
      })
      this.$store.commit('setPrint')
      // var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
      // win.document.body.innerHTML = "HTML";
    },

    closeDayReceipt(){
      this.printSelect = 0
      this.daySum = 0
      this.dayWeight = 0
      this.$store.commit('setPrint')
    },

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
      var customerData = (await CustomerService.index()).data
      this.customerNames = customerData.map(value => value.name).sort()
      
      // customer name
      this.customerName = this.$store.state.route.params.customerName
      customerData.forEach(item=>{
        if(item.name == this.customerName) this.customerInfo = item
      })
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
          sum+= item.cash
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
      if(this.editedItem.cash!='-') this.editedItem.cash = 0 - this.editedItem.cash
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
        item['cash'] = -item.cash
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

.receipt *{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.receipt{
  margin-left: 0;
  padding:0;
  margin-top: -80px;
}

.v-application p {
  margin-bottom:0;
  color: #000; 

}



</style>