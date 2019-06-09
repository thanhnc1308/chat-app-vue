<template>
  <div>
    <div class="users" v-if="users">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <User @changeActiveUser="changeActiveUser($event)" v-for="user in users" :key="user.id" :user="user"/>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import User from "@/components/users/User.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getUserData', 'getCurrentRoom', 'getSocket']),
  },
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
    if (this.getCurrentRoom) {
      this.users = this.getCurrentRoom.users;
    }
  },
  methods: {
    changeActiveUser(newActiveUserId) {
      this.activeUser = newActiveUserId;
      this.$emit('changeTitleActiveUser', this.users[newActiveUserId]);
    },
    addTestUsers() {
      for (let i = 0; i < 10; i++) {

        const newMsg = {
          id: `${i}`,
          username: `Thanh ${i}`,
          isOnline: true,
          created: new Date()
        };
        this.users.push(newMsg);
      }
    }
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
