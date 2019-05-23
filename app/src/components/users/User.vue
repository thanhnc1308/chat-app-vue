<template>
  <div class="user">
    <div class="user-image">
      <img src="@/assets/images/avatar.png" alt class="img-responsive">
      <span :class="['user-status', {'online' : user.isOnline}]"></span>
    </div>
    <div class="user-info">
      <h5>
        {{user.name}}
        <font-awesome-icon :class="['user-status',{'online' : user.isOnline}]" icon="circle"/>
      </h5>
      <p>Joined: {{calcJoinTime(user.created)}}</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["user"],
  computed: {},
  methods: {
    calcJoinTime(createdTime) {
      return moment(createdTime).fromNow();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.user {
  display: flex;
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
    padding-left: 8px;
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