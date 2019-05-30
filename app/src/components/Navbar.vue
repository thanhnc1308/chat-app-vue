<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-navbar">
    <router-link class="navbar-brand" to="/">
        <!-- <img src="@/assets/images/logo.png" width="30px" height="30px" alt="" srcset=""> -->
        <h5 style="color: #fff;">ChatApp</h5>
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-dark my-2 my-sm-0" type="submit">Search</button>
      </form>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active" v-if="!authUser">
          <router-link class="nav-link" to="/login">Login</router-link>
        </li>
        <li class="nav-item active" v-if="!authUser">
          <router-link class="nav-link" to="/signup">Signup</router-link>
        </li>
        <li class="nav-item dropdown" v-if="authUser">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >{{ authUser.name }}</a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" @click="logout" href="#">Log out</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>


<script>
export default {
    mounted() {
        // console.log(this.$root)
    },
    computed: {
        authUser() {
            return this.$root.auth.user
        }
    },
    methods: {
      logout() {
        //clean data from localStorage
        localStorage.removeItem('auth');
        //clean data from this.$root
        this.$root.auth = {};
        this.$noty.success("Successfully logout!");
      },
    },
}
</script>

<style scoped>
.navbar {
      z-index: 10;
}
</style>