<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="customers"
      sort-by="name"
      class="elevation-1">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>顧客資料</v-toolbar-title>
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
                新增顧客
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
                      label="顧客姓名"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.address"
                      label="地址">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.homePhone"
                      label="住家電話">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="手機電話">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.taxId"
                      label="統編/身分證號碼">
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
          class="mr-2"
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon
          small
          @click="navigateTo({
            name: 'trade',
            params: {
              customerName: item.name
            }
          })">
          mdi-eye
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

    </v-data-table>
  </v-container>
</template>

<script>
import CustomerService from '@/services/CustomerService'

export default {
  data: () => ({
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '顧客',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '地址', value: 'address', sortable: false},
      { text: '住家電話', value: 'homePhone', sortable: false},
      { text: '手機電話', value: 'phone', sortable: false},
      { text: '統編/身分證號碼', value: 'taxId', sortable: false},
      { text: '功能', value: 'actions', sortable: false },
    ],
    customers: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      address: '',
      phone: '',
      homePhone: '',
      taxId: ''
    },
    defaultItem: {
      name: '',
      address: '',
      phone: '',
      homePhone: '',
      taxId: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增顧客' : '編輯顧客'
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
    navigateTo (route) {
      this.$router.push(route)
    },

    async initialize () {
      this.customers = (await CustomerService.index()).data
      // console.log(this.customers)
    },

    editItem (item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try{
        await CustomerService.delete(this.editedItem)
        this.customers.splice(this.editedIndex, 1)
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
      if (this.editedIndex > -1) {
        try{
          await CustomerService.put(this.editedItem)
          Object.assign(this.customers[this.editedIndex], this.editedItem)
        }catch(err){
          console.log(err)
        }
      } else {
        try{
          await CustomerService.post(this.editedItem)
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
