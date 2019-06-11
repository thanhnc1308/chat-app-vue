<template>
  <div>
    <div class="users" v-if="users">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <div v-for="user in users" :key="user.lookup._id" class="user" :user-id="user.lookup._id" @click="activeUser()" @mouseenter="isHover = true" @mouseleave="isHover = false" :class="{'active' : isActive, 'hover' : isHover}">
          <div class="user-image">
            <vs-avatar  :text="user.lookup.username"/>
            <span :class="['user-status', {'online' : true}]"></span>
          </div>
          <div class="user-info">
            <h5>
              {{user.lookup.username}}
              <font-awesome-icon :class="['user-status',{'online' : true}]" icon="circle"/>
            </h5>
            <!-- <p>Joined: {{calcJoinTime(user.created)}}</p> -->
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapActions, mapGetters } from 'vuex';
import moment from "moment";

export default {
  computed: {
    ...mapGetters(['getUserData', 'getCurrentRoom', 'getSocket']),
  },
  props: ['users'],
  data() {
    return {
      isHover: false,
      isActive: false,
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    VuePerfectScrollbar
  },
  mounted() {

  },
  methods: {
    calcJoinTime(createdTime) {
      return moment(createdTime).fromNow();
    },
    activeUser() {
      this.$emit('changeActiveUser', this.user.id);
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

@import "@/assets/scss/variable.scss";

.active {
  background-color: rgba(0, 0, 0, .05);
}

.hover {
  background-color: rgba(0, 0, 0, .05);
}

.user {
  display: flex;
  cursor: pointer;
  border-bottom: 1px solid $border-color;
  padding: 8px;
  .user-image {
    width: 30px;
    margin-top: 5px;
    position: relative;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .user-info {
    margin-left: 16px;
    flex-grow: 1;

    h5 {
      font-size: 14px;
      margin-top: 17px;

      .user-status {
        font-size: 6px;
        margin-bottom: 4px;
      }

      &.online {
        color: #2ecc71 !important;
      }
    }
    p {
      font-size: 12px;
    }
  }
}
.online {
  color: #2ecc71 !important;
}
</style>
