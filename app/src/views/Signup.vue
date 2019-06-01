<template>
  <div class="row my-5">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-body">
          <h3 class="text-center my-4">Signup</h3>
          <form action @submit.prevent="handleSubmit" class="form">
            <div class="form-group">
              <input
                :class="{ 'is-invalid' : errors.name, 'is-valid' : !errors.name && submitted}"
                type="text"
                name="username"
                required
                v-model.trim="username"
                placeholder="Name"
                class="form-control"
              >
              <div class="errors" v-if="errors.name">
                <small class="text-danger" :key="error" v-for="error in errors.name">{{error}}</small>
              </div>
            </div>
            <div class="form-group">
              <input
                :class="{ 'is-invalid' : errors.email, 'is-valid' : !errors.email && submitted}"
                type="email"
                name="email"
                required
                v-model.trim="email"
                placeholder="Email"
                class="form-control"
              >
              <div class="errors" v-if="errors.email">
                <small class="text-danger" :key="error" v-for="error in errors.email">{{error}}</small>
              </div>
            </div>
            <div class="form-group">
              <input
                :class="{ 'is-invalid' : errors.password, 'is-valid' : !errors.password && submitted}"
                type="password"
                placeholder="Password"
                class="form-control"
                name="password"
                pattern=".{5,15}"
                title="Password must be between 5 and 15 characters"
                required
                v-model.trim="password"
              >
              <!-- <Error :errors="errors"/> -->
              <div class="errors" v-if="errors">
                <small class="text-danger" :key="error" v-for="error in errors">{{error.value}}</small>
              </div>
            </div>
            <div class="form-group text-center">
              <button type="submit" :disabled="loading" class="btn btn-success form-control">
                <!-- @click="registerUser()" -->
                <i v-if="loading" class="fas fa-spin fa-spinner"></i>
                {{ loading ? '' : 'Signup'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import axios from "axios";
import slugify from "slugify";
import Error from "@/components/error/Error.vue";
import setAuthToken from "@/utils/authToken";
import { mapActions, mapGetters } from "vuex";

export default {
  //this is called before the component is created --> this.$root.auth is not existed
  beforeRouteEnter(to, from, next) {
    //router-view will mount component only when we call next()
    //check if already exists auth
    if (localStorage.getItem("auth")) {
      return next({ path: "/" });
    }
    //else continue to render login
    next();
  },
  components: {
    Error
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errors: [],
      submitted: false, //by default, submitted is false, when success request or error request, submitted is true
      loading: false //by default, loading is false, when click sign up, loading is true
    };
  },
  methods: {
    ...mapActions(["saveUserData", "toggleAuthState"]),
    handleSubmit() {
      this.loading = true;
      this.errors = [];

      if (this.username && this.email && this.password) {
        axios
          .post(`${config.apiUrl}/api/auth/register`, {
            handle: slugify(this.username.toLowerCase()),
            username: this.username,
            email: this.email,
            password: this.password
          })
          .then(res => {
            this.loading = false; //when finish the request, loading = false
            this.submitted = true;

            if (res.data.errors) {
              for (const error of res.data.errors) {
                const [key] = Object.keys(error);
                const [value] = Object.values(error);
                this.errors.push({
                  key,
                  value
                });
              }
            } else {
              //   localStorage.setItem("authToken", res.data.token);
              //   this.$store.dispatch("toggleAuthState", true);
              //   this.$store.dispatch("saveUserData", true);

              //   setAuthToken(res.data.token);
              this.$vs.notify({
                text: "Successfully register!",
                color: "success",
                position: "top-center"
              });
              //   this.$router.push({
              //     name: "UserProfile",
              //     params: { handle: res.data.user.handle }
              //   });
              //route user to the homepage
              //$router is included in Vue.use(Router)
              this.$router.push("/login");
            }
          });
      }

      setTimeout(() => {
        this.errors = [];
      }, 1500);
    },
    registerUser() {
      this.loading = true; //when click signup, loading = true
      // this.$vs.loading();
      // setTimeout( ()=> {
      //     this.$vs.loading.close()
      // }, 2000);
      axios
        .post(`${config.apiUrl}/api/users/signup`, {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.loading = false; //when finish the request, loading = false
          this.submitted = true;
          this.$vs.notify({
            text: "Successfully register!",
            color: "success",
            position: "top-center"
          });
          // this.$noty.success("Successfully register!");
          //route user to the homepage
          //$router is included in Vue.use(Router)
          this.$router.push("/");
        }) //destructure and log err
        .catch(({ response }) => {
          this.loading = false;
          this.submitted = true;
          this.errors = response.data;
          this.$vs.notify({
            text: "Oops, something went wrong!",
            color: "danger",
            position: "top-center"
          });
          // this.$noty.error("Oops, something went wrong!");
        });
    }
  },
  computed: {
    ...mapGetters(["getSocket"])
  }
};
</script>