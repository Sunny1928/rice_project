<template>
  <v-app-bar fixed class="cyan" dark>
    <v-app-bar-title class="mr-4">
      <router-link 
        class="home"
        tag="span"
        :to="{
          name: 'root'
        }">
        年昌米廠
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

        
    <div v-if="$store.state.isUserLoggedIn">
      <v-btn 
        plain  
        :to="{
          name: 'customer'
        }">
        顧客
      </v-btn>
      <v-btn 
        plain 
        :to="{
          name: 'product'
        }">
        商品
      </v-btn>
      <v-btn 
        plain 
        :to="{
          name: 'sellUint'
        }">
        販賣單位
      </v-btn>
      <v-btn 
        plain 
        :to="{
          name: 'cashMethod'
        }">
        付款方式
      </v-btn>
      <v-btn 
        plain 
        :to="{
          name: 'trade',
          params:{
            customerName: 'null'
          }
        }">
        交易
      </v-btn>
    </div>

    <!-- <v-toolbar-items>
      <v-btn 
        flat 
        dark
        :to="{
          name: 'songs'
        }">
        Browse
      </v-btn>
    </v-toolbar-items> -->

    <v-spacer></v-spacer>

    <div>
      <!-- <v-btn 
        plain  
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn> -->
      <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        plain 
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>
      
      <v-btn 
        v-if="$store.state.isUserLoggedIn"
        plain
        @click="logout">
        Log Out
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  methods:{
    logout(){
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
.home:hover {
  color: rgb(255, 250, 210);
}
</style>