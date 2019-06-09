<template>
  <div class="room" :room-id="room.id" @click="activeroom()" @mouseenter="isHover = true" @mouseleave="isHover = false" :class="{'active' : isActive, 'hover' : isHover}">
    <div class="room-image">
      <vs-avatar :text="room.name" />
    </div>
    <div class="room-info">
      <div class="room-title">{{room.name}}</div>
      <p style="font-style: italic;">Last updated: {{moment(room.updated_at).fromNow()}}</p>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import moment from "moment";

export default {
  props: ["room", "isActive"],
  data() {
    return {
      isHover: false,
    }
  },
  computed: {
  },
  methods: {
    activeroom() {
      this.$emit('changeActiveroom', this.room.id);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.active {
  background-color: rgba(0, 0, 0, .05);
}

.hover {
  background-color: rgba(0, 0, 0, .05);
}

.room {
  display: flex;
  cursor: pointer;
  border-bottom: 1px solid $border-color;
  padding: 8px;
  padding-bottom: 0;
  .room-image {
    img {
      max-width: 100%;
    }
    .room-avatars {
      overflow: hidden;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      position: relative;

      &.room-avatars-1 {
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      &.room-avatars-2 {
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
      &.room-avatars-3 {
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
      &.room-avatars-4 {
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
  .room-info {
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
    .room-info {
      p {
        color: $primary-color;
      }
    }
  }
}
</style>