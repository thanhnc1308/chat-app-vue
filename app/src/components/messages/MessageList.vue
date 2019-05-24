<template>
  <div>
    <div class="messages">
      <Message v-for="message in messages" :key="message.id" :message="message"/>
    </div>
  </div>
</template>

<script>
import Message from "@/components/messages/Message.vue";

export default {
  // props: ["messages"],
  data() {
    return {
      messages: []
    };
  },
  components: {
    Message
  },
  mounted() {
    this.addTestMessage();
  },
  methods: {
    addTestMessage() {
      let isMe = false;

      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          isMe = true;
        } else {
          isMe = false;
        }

        const newMsg = {
          id: `${i}`,
          author: `Thanh ${i}`,
          text: `Hello there... ${i}`,
          avatar: "@/assets/images/avatar.png",
          me: isMe
        };
        this.messages.push(newMsg);

      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.messages {
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 60px - 58px - 50px);
  
  // top: $header-height  + 58px;
  bottom: 60px;
  position: absolute;
  width: calc(100vw - 600px);
}
</style>
