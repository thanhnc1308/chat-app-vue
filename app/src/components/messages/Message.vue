<template>
  <div :class="{'message' : true, 'me': message.me}">
    <div class="message-user-image">
      <img src="@/assets/images/avatar.png" alt class="img-responsive">
    </div>
    <div class="message-body">
      <div class="message-author">{{message.me ? 'You' : message.author}}</div>
      <div class="message-text">
        <p>{{message.text}}</p>
      </div>
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