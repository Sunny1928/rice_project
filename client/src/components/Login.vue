<template>
  <v-layout>
    <v-flex xs6 offset-xs3>
      <panel title="Login">
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field
            label="Account"
            v-model="account"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            autocomplete="new-password">
          </v-text-field>
          <div class="danger-alert" v-if="error">{{error}}</div>
          <v-btn
            dark
            class="cyan"
            @click="login">
            Login
          </v-btn>
        </div>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import Panel from './Panel.vue'

export default {
  components: { Panel },
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
        this.$router.push({
        name: 'root'
      })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped>
</style>