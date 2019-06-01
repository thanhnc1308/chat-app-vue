<template>
  <div class="reset">
    <div class="bg-navbar">
      <div class="container bg-navbar">
        <Navbar></Navbar>
      </div>
    </div>
    <!-- <div> -->
    <transition
      appear
      :name="transitionName"
      :enter-active-class="enterActive"
      :leave-active-class="leaveActive"
      class="trans-duration"
      mode="out-in"
    >
      <router-view/>
    </transition>
    <!-- </div> -->
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import _ from "lodash";
const DEFAULT_TRANSITION = "fade";
const DEFAULT_ENTER_ACTIVE_CLASS = "animated fadeIn fast";
const DEFAULT_LEAVE_ACTIVE_CLASS = "animated fadeOut fast";

export default {
  name: "app",
  components: {
    Navbar
  },
  data() {
    return {
      transitionName: DEFAULT_TRANSITION,
      leaveActive: DEFAULT_LEAVE_ACTIVE_CLASS,
      enterActive: DEFAULT_ENTER_ACTIVE_CLASS
    };
  },
  methods: {
    resetTransition() {
      this.transitionName = DEFAULT_TRANSITION;
      this.enterActive = DEFAULT_ENTER_ACTIVE_CLASS;
      this.leaveActive = DEFAULT_LEAVE_ACTIVE_CLASS;
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      if (!_.isEmpty(to.meta)) {
        if (to.meta.transitionName) {
          this.transitionName = to.meta.transitionName;
        }

        if (to.meta.enterActive) {
          this.enterActive = to.meta.enterActive;
        }

        if (to.meta.leaveActive) {
          this.leaveActive = to.meta.leaveActive;
        }
      }

      if (!to.meta.requiresAuth) {
        this.resetTransition();
      }
      next();
    });
  }
};
</script>

<style lang="scss">
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

.trans-duration {
  animation-duration: 10s;
  animation-delay: 10s;
}
</style>
