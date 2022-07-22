<template>
  <v-layout>
    <div v-if="!$store.state.isUserLoggedIn">
      You have not login in yet
    </div>
    <v-flex xs6 offset-xs3 v-else>
      <h1>Basic Info</h1>
      <v-row>
        <v-col
          cols="12"
          md="3">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'customer'
            }">
            顧客
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'product'
            }">
            商品
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'sellUint'
            }">
            販賣單位
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'cashMethod'
            }">
            付款方式
          </v-btn>
        </v-col>
      </v-row>
      <br>
      <h1>Main Func</h1>
      <v-row>
        <v-col
          cols="12"
          md="12">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'trade',
              params:{
                customerName:'null'
              }
            }">
            交易
          </v-btn>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return{

      }
    },
    methods: {
      navigateTo (route) {
        this.$router.push(route)
      }
    }
      
  }
</script>
