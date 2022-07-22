<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="products"
      sort-by="name"
      class="elevation-1">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>產品資訊</v-toolbar-title>
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
                新增產品
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.name"
                      label="產品名稱"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                      <v-text-field
                        class="pr-4"
                        v-model="editedItem.number"
                        label="數量">
                      </v-text-field>
                      <v-select
                        v-model="editedItem.uint"
                        :items="productUint"
                        label="單位">
                      </v-select>
                  </v-row>
                  <v-row>
                      <v-select
                        class="pr-4"
                        v-model="editedItem.sellUint"
                        :items="productSellUint"
                        label="販賣單位">
                      </v-select>
                      <v-text-field
                        v-model="editedItem.price"
                        label="單價">
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
        <p class="ma-3">You haven't add any data</p>
        <p class="ma-3">If you add, click the reset button</p>
        <v-btn
          class="mb-3"
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
import SellUintService from '@/services/SellUintService'

export default {
  data: () => ({
    productUint:['公斤', '台斤'],
    productSellUint:[],
    // productSellUint:['公斤', '台斤', '包', '箱', '個', '車', '件', '斗'],
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '產品',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '數量', value: 'number', sortable: false},
      { text: '單位', value: 'uint', sortable: false},
      { text: '販賣單位', value: 'sellUint', sortable: false},
      { text: '單價', value: 'price', sortable: false},
      { text: '功能', value: 'actions', sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      number: '',
      uint: '',
      sellUint: '',
      price: ''
    },
    defaultItem: {
      name: '',
      number: '',
      uint: '',
      sellUint: '',
      price: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增產品' : '編輯產品'
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
      this.products = (await ProductService.index()).data
      this.productSellUint = (await SellUintService.index()).data.map(value => value.name);
    },

    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try{
        await ProductService.delete(this.editedItem)
        this.products.splice(this.editedIndex, 1)
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

      if (this.editedIndex > -1) {
        try{
          await ProductService.put(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      } else {
        try{
          await ProductService.post(item)
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
