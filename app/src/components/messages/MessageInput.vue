<template>
  <div class="messenger-input">
    <div class="text-input">
      <!-- <textarea name id placeholder="Write your messages..."></textarea> -->
      <vs-textarea v-model="inputMessage" />
    </div>
    <div class="actions">
      <!-- <button class="btn btn-primary send">Send</button> -->
      <div class="send">
        <vs-button color="primary" type="border" icon="send"></vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageInput",
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
    }
  }
}
</style>
