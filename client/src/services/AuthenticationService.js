import Api from '@/services/Api'

export default {
    register (credentials){
        return Api().post('register', credentials)
    }
}

// AuthenticationService.register({
//     account: 'admin',
//     password: '123456'
// })