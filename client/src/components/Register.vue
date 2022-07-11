<template>
  <div>
    <h1>Register</h1>

    <input
      type="text"
      name="account"
      v-model="account"
      placeholder="account">
    <br>
    <input
      type="password"
      name="password"
      v-model="password"
      placeholder="password">
    <br>
    <button @click="register">Register</button>
  </div>
</template>

<script>
import AuthencationService from '@/services/AuthenticationService'
export default {
  name: 'HelloWorld',
  data () {
    return {
      account:'',
      password:''
    }
  },
  methods: {
    async register () {
      await AuthencationService.register({
        account: this.account,
        password: this.password
      })
    }
  }
}
</script>

<style scoped>

</style>
