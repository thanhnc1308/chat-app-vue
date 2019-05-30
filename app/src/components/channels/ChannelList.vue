<template>
  <div>
    <div class="channels">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <Channel @changeActiveChannel="changeActiveChannel($event)" :isActive="channel.id === activeChannel" v-for="channel in channels" :key="channel.id" :channel="channel"/>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import Channel from "@/components/channels/Channel.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
// import eventBus from '@/main.js';

export default {
  // created() {
  //   eventBus.$emit('firstChannel', this.channels[1]);
  // },
  data() {
    return {
      channels: [],
      activeChannel: 0,
      settings: {
        //perfect scrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    Channel,
    VuePerfectScrollbar
  },
  mounted() {
    this.addTestChannels();
  },
  methods: {
    addTestChannels() {
      for (let i = 0; i < 10; i++) {
        const newChannel = {
          id: `${i}`,
          title: `Channel ${i}`,
          lastMessage: `Message ${i}`
        };
        this.channels.push(newChannel);
      }
    },
    changeActiveChannel(newActiveChannelId) {
      this.activeChannel = newActiveChannelId;
      this.$emit('changeTitleActiveChannel', this.channels[newActiveChannelId]);
    }
  }
};
</script>

<style lang="scss" scoped>
.channels {
  overflow-y: auto;
  height: calc(100vh - 50px - 58px);
  
  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
}
</style>
