<template>
  <div>
    <div class="users">
      <User v-for="user in users" :key="user.id" :user="user"/>
    </div>
  </div>
</template>

<script>
import User from "@/components/users/User.vue";

export default {
  data() {
    return {
      users: []
    };
  },
  components: {
    User,
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
          created: new Date(),
        };
        this.users.push(newUser);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.users {

}
</style>
