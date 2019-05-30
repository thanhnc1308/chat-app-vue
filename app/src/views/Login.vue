<template>
    <div class="row my-5">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-body">
                    <h3 class="text-center my-4">Login</h3>
                    <div class="form-group">
                        <input :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && submitted}" v-model="email" type="text" placeholder="Email" class="form-control">
                        <div v-if="errors.email" class="errors">
                            <small class="text-danger" :key="error" v-for="error in errors.email">{{error}}</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <input :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && submitted}" v-model="password" type="password" placeholder="Password" class="form-control">
                        <div v-if="errors.password" class="errors">
                            <small class="text-danger" :key="error" v-for="error in errors.password">{{error}}</small>
                        </div>
                    </div>
                    <div class="form-group text-center">
                        <button @click="loginUser" :disabled="loading" class="btn btn-success form-control">
                            <i v-if="loading" class="fas fa-spin fa-spinner"></i>
                            {{loading ? '' : 'Login'}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';
import config from '@/config';

export default {
    //this is called before the component is created --> this.$root.auth is not existed
    beforeRouteEnter (to, from, next) {
        //router-view will mount component only when we call next()
        //check if already exists auth
        if (localStorage.getItem('auth')) {
            return next( { path: '/'} );
        }
        //else continue to render login
        next();
    },
    data() {
        return {
            email : '',
            password : '',
            errors : {},
            submitted: false,
            loading:false,
        }
    },
    methods: {
        loginUser() {
            this.loading = true;
            Axios.post(`${config.apiUrl}/api/users/login`, {
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.submitted = true;
                this.loading = false;
                const { data } = response.data;
                this.$root.auth = data;
                localStorage.setItem('auth', JSON.stringify(data));
                this.$vs.notify({text:'Successfully login!',color:'success',position:'top-center'});
                // this.$noty.success("Successfully login!");
                //route user to the homepage
                //$router is included in Vue.use(Router)
                this.$router.push('/');
            })
            .catch( ({response}) => {
                this.submitted = true;
                this.loading = false;
                this.$vs.notify({text:'Oops, something went wrong!',color:'danger',position:'top-center'});
                // this.$noty.error("Oops, something went wrong!");
                //set my own errors notiication
                if (response.status === 401) {
                    this.errors = {
                        email: ['These credentials do not match our records'],
                    }
                } else {
                    this.errors = response.data;
                }
                console.log(this.errors);
            });
        },
    },
}
</script>