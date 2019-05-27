<template>
  <div>
    <div class="messages">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <Message v-for="message in messages" :key="message.id" :message="message"/>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import Message from "@/components/messages/Message.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  // props: ["messages"],
  data() {
    return {
      messages: [],
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
    };
  },
  components: {
    Message,
    VuePerfectScrollbar,
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
  // overflow-y: auto;
  height: calc(100% - 60px - 58px - 50px);

  // top: $header-height  + 58px;
  bottom: 60px;
  position: absolute;
  width: calc(100vw - 600px);

  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}
</style>
