<template>
  <div>
    <Messenger></Messenger>
  </div>
</template>


<script>
import Messenger from "@/views/Messenger.vue";

export default {
  beforeRouteEnter(to, from, next) {
    let authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return next({ path: "/login" });
    }
    next();
  },
  components: {
    Messenger
  },
  methods: {
    checkAuth() {
      let authToken = JSON.parse(localStorage.getItem("authToken"));
      if (!authToken) {
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variable.scss";

body {
  color: $body-color;
}
</style>
