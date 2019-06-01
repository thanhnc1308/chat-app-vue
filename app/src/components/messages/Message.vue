<template>
  <div :class="{'message' : true, 'me': message.admin}">
    <div class="message-user-image">
      <vs-avatar :text="getAuthor"/>
    </div>
    <div class="message-body">
      <div class="message-author">{{message.admin ? 'You' : message.user}}</div>

      <vs-tooltip
        :position="message.admin ? 'right' : 'left'"
        :text="moment(message.created_at).fromNow()"
      >
        <div class="message-text">
          <span>{{message.content}}</span>
        </div>
      </vs-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message"],
  computed: {
    time() {
      // const time = new Date(this.message.timestamp);
      // return `${time.getHours()}:${leftPad(time.getMinutes(), 2, '0')}`;
    },
    getAuthor() {
      return this.message.admin ? "You" : this.message.user;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.message {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 15px 0;

  .message-user-image {
    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }

  .message-body {
    .message-author {
    }

    .message-text {
      background: $primary-color;
      padding: 10px;
      border-radius: 10px;
      p {
        margin-bottom: 0;
      }
    }
  }

  &.me {
    justify-content: flex-end;
    .message-body {
      .message-text {
        background: $secondary-color;
        color: #fff;
      }
    }
  }
}
</style>