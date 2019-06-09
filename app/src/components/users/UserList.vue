<template>
  <div>
    <div class="users" v-if="users">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <div v-for="user in users" :key="user.id" class="user" :user-id="user.id" @click="activeUser()" @mouseenter="isHover = true" @mouseleave="isHover = false" :class="{'active' : isActive, 'hover' : isHover}">
          <div class="user-image">
            <vs-avatar  :text="user.username"/>
            <span :class="['user-status', {'online' : user.isOnline}]"></span>
          </div>
          <div class="user-info">
            <h5>
              {{user.username}}
              <font-awesome-icon :class="['user-status',{'online' : user.isOnline}]" icon="circle"/>
            </h5>
            <p>Joined: {{calcJoinTime(user.created)}}</p>
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
  data() {
    return {
      users: [],
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
    if (this.getCurrentRoom) {
      this.users = this.getCurrentRoom.users;
    }
  },
  methods: {
    calcJoinTime(createdTime) {
      return moment(createdTime).fromNow();
    },
    activeUser() {
      this.$emit('changeActiveUser', this.user.id);
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
