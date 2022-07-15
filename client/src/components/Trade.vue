<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="trades"
      sort-by="calories"
      class="elevation-1">

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
                  :label="`Switch 1: ${switch1.toString()}`"
                ></v-switch>
              </v-card-title>

              <v-card-text>
                <v-container v-if="!switch1">
                  <v-row>
                    <v-select
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
                      :items="productName"
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

              <div class="danger-alert" v-if="error">
                {{error}}
              </div>

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
                  @click="save">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個客戶嗎？</v-card-title>
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
        <v-btn
          color="primary"
          @click="initialize">
          Reset
        </v-btn>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import ProductService from '@/services/ProductService'
import TradeService from '@/services/TradeService'

export default {
  data: () => ({
    switch1: false,
    productName: [],
    customerName: '',
    required: (value) => value.toString().length !== 0 || 'Required.',
    error:'',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '日期', value: 'date', sortable: false},
      {
        text: '產品',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '數量', value: 'amount', sortable: false},
      { text: '包數', value: 'package', sortable: false},
      { text: '總數量', value: 'totalNumber', sortable: false},
      { text: '單位', value: 'uint', sortable: false},
      { text: '單價', value: 'price', sortable: false},
      { text: '小計', value: 'aTradePrice', sortable: false},
      { text: '現金收款', value: 'cash', sortable: false},
      { text: '現金收款日期', value: 'cashDate', sortable: false},
      { text: '累計', value: 'grandPrice', sortable: false},
      { text: '功能', value: 'actions', sortable: false },
    ],
    trades: [],
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
  },

  watch: {
    dialog (val) {
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
    async initialize () {
      this.customerName = this.$store.state.route.params.customerName
      // console.log(this.customerName)

      const products = (await ProductService.index()).data
      var namePriceProduct = {}
      var nameUintProduct = {}
      products.forEach(item=>{
        this.productName.push(item.name)
        namePriceProduct[item.name] = item.price
        nameUintProduct[item.name] = item.uint
      })
      // console.log(namePriceProduct)

      this.trades = (await TradeService.index(this.customerName)).data
      // console.log(this.trades)

      var sum = 0
      this.trades.forEach(item=>{
        item['date'] = item.createdAt.slice(0,10) + ' ' + item.createdAt.slice(11,19)
        item['price'] = namePriceProduct[item.name]
        item['uint'] = nameUintProduct[item.name]


        if (item.amount == null){
          item['totalNumber'] = '-'
          item['aTradePrice'] = '-'
          sum-= item.cash
          item['grandPrice'] = sum
        }else{
          item['totalNumber'] = item.amount*item.package
          item['aTradePrice'] = item.totalNumber*item.price
          sum+= item.aTradePrice
          item['grandPrice'] = sum
        }
        // console.log(item)
      })
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
      this.error = ''
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
      // const areAllFiledsFilledIn = Object.keys(this.editedItem).every(key => !! this.editedItem[key])
      // if(!areAllFiledsFilledIn){
      //   this.error = '請把所有資訊格填完'
      //   return
      // }

      var item = this.editedItem
      item['customer_name'] = this.customerName
      item['user_name'] = this.$store.state.user.account
      // console.log(item)

      if (switch1) {
        item['package'] = ''
        item['amount'] = ''
      }

      if (this.editedIndex > -1) {
        try{
          await TradeService.put(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      } else {
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
