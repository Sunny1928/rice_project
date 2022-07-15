<template>
  <v-layout>
    <v-flex xs6 offset-xs3>
      <h1>Basic Info</h1>
      <v-row>
        <v-col
          cols="12"
          md="6">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'customer'
            }">
            Customer
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="6">
          <v-btn
            class="cyan d-flex align-center"
            dark
            height="200"
            :to="{
              name: 'product'
            }">
            Product
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
              name: 'trade'
            }">
            Trade
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

    }
      
  }
</script>
