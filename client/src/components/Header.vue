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
          name: 'login'
        }">
        Login
      </v-btn>
      
      <v-btn 
        plain  
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn>
      
      <v-btn 
        plain >
        Log Out
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  
}
</script>

<style scoped>
.home {
  cursor: pointer;
}
.home:hover {
  color: #E9E;
}
</style>