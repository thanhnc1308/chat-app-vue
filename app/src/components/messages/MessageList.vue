<template>
  <div>
    <div class="messages" v-if="messages">
      <transition-group name="slideDown">
        <VuePerfectScrollbar v-chat-scroll class="scroll-area" :settings="settings">
        <Message v-for="message in messages" :key="message.id" :message="message"/>
      </VuePerfectScrollbar>
      </transition-group>
      
    </div>
  </div>
</template>

<script>
import Message from "@/components/messages/Message.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import io from 'socket.io-client';
import { mapGetters } from 'vuex';

export default {
  // props: ["messages"],
  computed: {
        ...mapGetters(['getUserData'])
    },
  data() {
    return {
      messages: [],
      user: null,
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
    };
  },
  created() {
        this.user = this.getUserData;
    },
  components: {
    Message,
    VuePerfectScrollbar,
  },
  mounted() {
    this.addTestMessage();
    // this.scrollMessages();
  },
  methods: {
    scrollMessages() {
            var container = this.$refs.messages;
            container.scrollTop = container.scrollHeight;
        },
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
          user: `Thanh ${i}`,
          content: `Hello there... ${i}`,
          avatar: "@/assets/images/avatar.png",
          admin: isMe,
          created_at: new Date(),
        };
        this.messages.push(newMsg);
      }
    }
  },
  //   updated() {
  //       this.scrollMessages();
  //   }
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
