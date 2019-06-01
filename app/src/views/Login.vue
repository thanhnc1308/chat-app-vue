<template>
  <div class="row my-5">
    <div class="col-md-6 offset-md-3">
      <div class="card">
        <div class="card-body">
          <h3 class="text-center my-4">Login</h3>
          <form action @submit.prevent="handleSubmit" class="form">
            <div class="form-group">
              <input
                :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && submitted}"
                v-model.trim="email"
                type="text"
                name="email"
                placeholder="Email"
                required
                class="form-control"
              >
              <div v-if="errors.email" class="errors">
                <small class="text-danger" :key="error" v-for="error in errors.email">{{error}}</small>
              </div>
            </div>
            <div class="form-group">
              <input
                :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && submitted}"
                v-model.trim="password"
                name="password"
                type="password"
                pattern=".{5,15}"
                title="Password must be between 5 and 15 characters"
                required
                placeholder="Password"
                class="form-control"
              >
              <div v-if="errors" class="errors">
                <small class="text-danger" :key="error" v-for="error in errors">{{error.value}}</small>
              </div>
              <!-- <Error :errors="errors"/> -->
            </div>
            <div class="form-group text-center">
              <button type="submit" :disabled="loading" class="btn btn-success form-control">
                <!-- button @click="loginUser" -->
                <i v-if="loading" class="fas fa-spin fa-spinner"></i>
                {{loading ? '' : 'Login'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
import Error from "@/components/error/Error.vue";
import { mapActions } from "vuex";
import setAuthToken from "@/utils/authToken";

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
      email: "",
      password: "",
      errors: [],
      submitted: false,
      loading: false
    };
  },
  methods: {
    ...mapActions(["saveUserData", "toggleAuthState"]),

    handleSubmit() {
      this.loading = true;
      this.errors = [];
      if (this.email && this.password) {
        axios
          .post(`${config.apiUrl}/api/auth/login`, {
            email: this.email,
            password: this.password
          })
          .then(res => {
            this.submitted = true;
            this.loading = false;

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
              localStorage.setItem("authToken", res.data.token);
              this.$store.dispatch("toggleAuthState", true);
              this.$store.dispatch("saveUserData", res.data.user);

              setAuthToken(res.data.token);

              const { data } = res.data;
              this.$root.auth = data;
              this.$vs.notify({
                text: "Successfully login!",
                color: "success",
                position: "top-center"
              });

              //route user to the homepage
              //$router is included in Vue.use(Router)
              this.$router.push("/");

              //   this.$router.push({
              //     name: "UserProfile",
              //     params: { handle: res.data.user.handle }
              //   });
            }
          });
      }

      setTimeout(() => {
        this.errors = [];
      }, 1500);
    },
    loginUser() {
      this.loading = true;
      axios
        .post(`${config.apiUrl}/api/users/login`, {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.submitted = true;
          this.loading = false;
          const { data } = response.data;
          this.$root.auth = data;
          localStorage.setItem("auth", JSON.stringify(data));
          this.$vs.notify({
            text: "Successfully login!",
            color: "success",
            position: "top-center"
          });
          // this.$noty.success("Successfully login!");
          //route user to the homepage
          //$router is included in Vue.use(Router)
          this.$router.push("/");
        })
        .catch(({ response }) => {
          this.submitted = true;
          this.loading = false;
          this.$vs.notify({
            text: "Oops, something went wrong!",
            color: "danger",
            position: "top-center"
          });
          // this.$noty.error("Oops, something went wrong!");
          //set my own errors notiication
          if (response.status === 401) {
            this.errors = {
              email: ["These credentials do not match our records"]
            };
          } else {
            this.errors = response.data;
          }
          console.log(this.errors);
        });
    }
  }
};
</script>