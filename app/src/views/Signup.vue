<template>
    <div class="row my-5">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-body">
                    <h3 class="text-center my-4">Signup</h3>
                    <div class="form-group">
                        <input :class="{ 'is-invalid' : errors.name, 'is-valid' : !errors.name && submitted}" v-model="name" type="text" placeholder="Name" class="form-control">
                        <div class="errors" v-if="errors.name">
                            <small class="text-danger" :key="error" v-for="error in errors.name">{{error}}</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <input :class="{ 'is-invalid' : errors.email, 'is-valid' : !errors.email && submitted}" v-model="email" type="text" placeholder="Email" class="form-control">
                        <div class="errors" v-if="errors.email">
                            <small class="text-danger" :key="error" v-for="error in errors.email">{{error}}</small>
                        </div>
                    </div>
                    <div class="form-group">
                        <input :class="{ 'is-invalid' : errors.password, 'is-valid' : !errors.password && submitted}" v-model="password" type="password" placeholder="Password" class="form-control">
                        <div class="errors" v-if="errors.password">
                            <small class="text-danger" :key="error" v-for="error in errors.password">{{error}}</small>
                        </div>
                    </div>
                    <div class="form-group text-center">
                        <button @click="registerUser()" :disabled="loading" class="btn btn-success form-control">
                            <i v-if="loading" class="fas fa-spin fa-spinner"></i>
                            {{ loading ? '' : 'Signup'}}
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
            name: '',
            email: '',
            password: '',
            errors: {},
            submitted: false,   //by default, submitted is false, when success request or error request, submitted is true
            loading: false, //by default, loading is false, when click sign up, loading is true
        }
    },
    methods: {
        registerUser() {
            this.loading = true;    //when click signup, loading = true
            // this.$vs.loading();
            // setTimeout( ()=> {
            //     this.$vs.loading.close()
            // }, 2000);
            Axios.post(`${config.apiUrl}/auth/register`, {
                name: this.name,
                email: this.email,
                password: this.password
            })
            .then(response => {
                this.loading = false;   //when finish the request, loading = false
                this.submitted = true;
                this.$vs.notify({text:'Successfully register!',color:'success',position:'top-center'});
                // this.$noty.success("Successfully register!");
                //route user to the homepage
                //$router is included in Vue.use(Router)
                this.$router.push('/');
            }) //destructure and log err
            .catch(({response}) => {
                this.loading = false;
                this.submitted = true;
                this.errors = response.data;
                this.$vs.notify({text:'Oops, something went wrong!',color:'danger',position:'top-center'});
                // this.$noty.error("Oops, something went wrong!");
            });
        },
    },
};
</script>