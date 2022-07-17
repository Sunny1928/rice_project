<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="sellUints"
      sort-by="name"
      class="elevation-1">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>販賣單位資料</v-toolbar-title>
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
                新增販賣單位
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
                      label="販賣單位"
                      :rules="[required]">
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
import SellUintService from '@/services/SellUintService'

export default {
  data: () => ({
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '販賣單位',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '功能', value: 'actions', sortable: false },
    ],
    sellUints: [],
    editedIndex: -1,
    editedItem: {
      name: ''
    },
    defaultItem: {
      name: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增販賣單位' : '編輯販賣單位'
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
      this.sellUints = (await SellUintService.index()).data
      // console.log(this.sellUints)
    },

    editItem (item) {
      this.editedIndex = this.sellUints.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.sellUints.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      try{
        await SellUintService.delete(this.editedItem)
        this.sellUints.splice(this.editedIndex, 1)
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
          await SellUintService.put(this.editedItem)
          Object.assign(this.sellUints[this.editedIndex], this.editedItem)
        }catch(err){
          console.log(err)
        }
      } else {
        try{
          await SellUintService.post(this.editedItem)
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
