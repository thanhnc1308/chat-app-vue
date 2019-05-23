<template>
  <div class="messenger-input">
    <div class="text-input">
      <textarea name id placeholder="Write your messages..."></textarea>
    </div>
    <div class="actions">
      <button class="btn btn-primary send">Send</button>
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
      message: ""
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.messenger-input {
  border-top: 1px solid $border-color;
  height: 80px;
  display: flex;
  flex-direction: row;
  .text-input {
    flex-grow: 1;
    textarea {
      border: 0 none;
      width: 100%;
      height: 100%;
      padding: 8px 15px;
    }
  }
  .actions {
    display: flex;
    button.send {
      color: #fff;
      border: 0 none;
      padding: 7px 15px;
      margin: auto 10px;
    }
  }
}
</style>
