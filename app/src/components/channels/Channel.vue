<template>
  <div class="channel">
    <div class="channel-image">
      <img src="@/assets/images/avatar.png" alt>
    </div>
    <div class="channel-info">
      <div class="channel-title">{{channel.title}}</div>
      <p>{{channel.lastMessage}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["channel"],
  computed: {
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.channel {
  cursor: pointer;
  display: flex;
  border-bottom: 1px solid $border-color;
  padding: 8px;
  .channel-image {
    width: 30px;
    img {
      max-width: 100%;
    }
    .channel-avatars {
      overflow: hidden;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      position: relative;

      &.channel-avatars-1 {
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      &.channel-avatars-2 {
        img {
          width: 50%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
          }
        }
      }
      &.channel-avatars-3 {
        img {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          &:last-child {
            bottom: 0;
            right: 0;
            top: 15px;
            width: 50%;
            height: 50%;
          }
        }
      }
      &.channel-avatars-4 {
        img {
          position: absolute;
          width: 50%;
          height: 50%;
          right: 0;
          top: 0;
          &:first-child {
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          &:nth-child(3n) {
            bottom: 0;
            right: 0;
            top: 15px;
            width: 50%;
            height: 50%;
          }
          &:last-child {
            left: 0;
            bottom: 0;
            top: 15px;
          }
        }
      }
    }
  }
  .channel-info {
    flex-grow: 1;
    padding-left: 8px;
    padding-right: 8px;
    overflow: hidden;
    h2 {
      font-size: 13px;
      font-weight: 400;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    p {
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &.active {
    background: rgba(0, 0, 0, 0.05);
  }
  &.notify {
    .channel-info {
      p {
        color: $primary-color;
      }
    }
  }
}
</style>