<template>
  <div class="messenger-input">
    <div class="text-input">
      <vs-textarea v-model="inputMessage" placeholder="Write your messages..."/>
    </div>
    <div class="actions">
      <!-- <button class="btn btn-primary send">Send</button> -->
      <div class="send">
        <!-- <vs-button color="primary" type="border" icon="send"></vs-button> -->
        <send-icon class="custom-class"></send-icon>
      </div>
    </div>
  </div>
</template>

<script>

import { SendIcon } from 'vue-feather-icons';

export default {
  name: "MessageInput",
  components: {
    SendIcon,
  },
  props: ["onSend"],
  methods: {
    onKeyDown() {
      if (this.message) {
        this.onSend(this.message);
        this.message = "";
      }
    }
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
