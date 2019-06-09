<template>
  <div class="messenger-input">
    <div class="text-input">
      <!-- handle enter to send messages and shift enter to new line -->
      <vs-textarea @keyup="triggerMessageSend"  @keydown.enter.exact.prevent @keyup.enter.exact="sendMessage()"
    @keydown.enter.shift.exact="newline" v-model.trim="inputMessage" placeholder="Write your messages..."/>
      <!-- <vs-input class="inputx" @keypress.enter="sendMessage()" v-model="inputMessage" placeholder="Write your messages..."/> -->
    </div>
    <div class="actions">
      <!-- <button class="btn btn-primary send">Send</button> -->
      <div class="send">
        <!-- <vs-button color="primary" type="border" icon="send"></vs-button> -->
        <send-icon @click="sendMessage" class="custom-class"></send-icon>
      </div>
    </div>
  </div>
</template>

<script>

import { SendIcon } from 'vue-feather-icons';
import { mapGetters } from 'vuex';

export default {
  name: "MessageInput",
  components: {
    SendIcon,
  },
  data() {
    return {
      inputMessage,
    }
  },
  props: [""],
  computed: {
        ...mapGetters(['getUserData', 'getCurrentRoom', 'getSocket'])
    },
  methods: {
    sendUserTyping() {
            this.getSocket.emit('userTyping', {
                room: this.getCurrentRoom,
                user: this.getUserData
            });
        },
        sendUserNotTyping() {
            this.getSocket.emit('removeUserTyping', {
                room: this.getCurrentRoom,
                user: this.getUserData
            });
        },
        triggerMessageSend(e) {
            e.preventDefault();
            if (e.keyCode === 13 && !e.shiftKey) {
                this.sendMessage();
            } else {
                if (this.inputMessage !== '') {
                    this.sendUserTyping();
                } else {
                    this.sendUserNotTyping();
                }
            }
        },
        sendMessage() {
          debugger
            this.getSocket.emit('newMessage', {
                room: this.getCurrentRoom,
                // user: this.getUserData,
                user: JSON.parse(localStorage.getItem('authUser')),
                content: this.inputMessage
            });
            debugger
            this.inputMessage = '';
            this.sendUserNotTyping();
        },
    newline() {
      this.value = `${this.value}\n`;
    },
  },
  data() {
    return {
      message: "",
      inputMessage: "",
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.messenger-input {
  border-top: 1px solid $border-color;
  height: 60px;
  position: absolute;
  bottom: 0;
  width: calc(100vw - 600px);
  display: flex;
  flex-direction: row;
  .text-input {
    flex-grow: 1;
    textarea {

    }
  }
  .actions {
    display: flex;
    .send {
      color: #fff;
      margin: auto 10px;
      .custom-class {
        color: #3498db;
        border: 1px solid #3498db;
        padding: 5px;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
    }
  }
}
</style>
