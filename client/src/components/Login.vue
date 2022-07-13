<template>
  <v-layout>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-app-bar flat dense class="cyan" dark>
        <v-app-bar-title>Login</v-app-bar-title>
        </v-app-bar>

        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
            label="Account"
            v-model="account"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password"
          ></v-text-field>
            <v-btn
            dark
            class="cyan"
            @click="login">
            Login
            </v-btn>
        </div>
        
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      account: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        const response = await AuthenticationService.login({
          account: this.account,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
</style>