<template>
  <div>
    <div class="users">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <User @changeActiveUser="changeActiveUser($event)" v-for="user in users" :key="user.id" :user="user"/>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import User from "@/components/users/User.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  data() {
    return {
      users: [],
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    User,
    VuePerfectScrollbar
  },
  mounted() {
    this.addTestUsers();
  },
  methods: {
    addTestUsers() {
      let isOnline = true;
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          isOnline = true;
        } else {
          isOnline = false;
        }

        const newUser = {
          id: `${i}`,
          name: `User ${i}`,
          isOnline: isOnline,
          created: new Date()
        };
        this.users.push(newUser);
      }
    },
    changeActiveUser(newActiveUserId) {
      this.activeUser = newActiveUserId;
      this.$emit('changeTitleActiveUser', this.users[newActiveUserId]);
    },
  }
};
</script>

<style lang="scss" scoped>
.users {
  overflow-y: auto;
  height: calc(100vh - 50px - 58px - 80px);

  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}
</style>
