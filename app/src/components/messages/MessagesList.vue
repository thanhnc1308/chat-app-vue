<template>
  <div>
    <!-- <vs-card title="Chat" class="overflow-hidden"> -->
    <!-- <template slot="no-body"> -->
    <div class="chat-card-log">
      <VuePerfectScrollbar ref="chatLogPS" class="scroll-area pt-6 px-6" :settings="settings">
        <ul ref="chatLog">
          <li
            class="flex items-start"
            :class="{'flex-row-reverse' : msg.isSent,  'mt-4': index}"
            v-for="(msg, index) in chatMsg"
            :key="index"
          >
            <vs-avatar size="40px" class="m-0 flex-no-shrink" :class="msg.isSent ? 'ml-5' : 'mr-5'"></vs-avatar>
            <div
              class="msg relative bg-white shadow-md py-3 px-4 bm-2 rounded-lg max-w-md"
              :class="{'chat-sent=msg bg-primary-gradient text-white' : msg.isSent, 'border border-solid border-grey-light' : msg.isSent}"
            >
              <span>{{msg.msg}}</span>
            </div>
          </li>
        </ul>
      </VuePerfectScrollbar>
    </div>
    <!-- end chat card log -->
    <!-- <div class="flex bg-white chat-input-container p-6"></div> -->
    <!-- <vs-input
        class="mr-3 w-full"
        v-model="chatMsgInput"
        @keyup.enter="chatMsgInput = ''"
        placeholder="Write your message..."
      ></vs-input>
    <send-icon class="custom-class" @click="chatMsgInput = ''"></send-icon>-->
    <!-- <vs-button icon-pack="feather" icon="icon-send" @click="chatMsgInput = ''"></vs-button> -->
    <!-- </template> -->
    <!-- </vs-card> -->
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { SendIcon } from "vue-feather-icons";

export default {
  data() {
    return {
      chatMsgInput: "",
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
      chatMsg: []
    };
  },
  components: {
    VuePerfectScrollbar,
    SendIcon
  },
  mounted() {
    this.addTestMessage();
    // this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight;
  },
  methods: {
    addTestMessage() {
      for (let i = 0; i < 10; i++) {
        let isSent = true;
        if (i % 2 == 0) {
          isSent = false;
        } else {
          isSent = true;
        }
        let newMsg = {
          senderImg: `user.png`,
          msg: `message ${i}`,
          isSent: isSent
        };
        this.chatMsg.push(newMsg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "@/assets/scss/messages-list.scss";
.chat-card-log {
  height: 400px;
  .scroll-area {
    position: relative;
    margin: auto;
    width: 400px;
    height: 300px;
  }
  .chat-input-container {
    background: #f2f4f7;
  }
}
</style>
