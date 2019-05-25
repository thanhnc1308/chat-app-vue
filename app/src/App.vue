<template>
  <div class="reset">
    <div class="bg-navbar">
      <div class="container bg-navbar">
        <Navbar></Navbar>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar
  },
  data() {
    return {
      
    };
  },
};
</script>

<style>
* {
  font-family: "Poppins";
}
body {
  background-color: #f5f3ef;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.bg-navbar {
  background: #3498db;
}

#app {
  overflow: hidden;
}

</style>
