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
      <v-btn 
        plain  
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>
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
        name: 'root'
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