<template>
  <div>
    <div class="channels">
      <Channel v-for="channel in channels" :key="channel.id" :channel="channel"/>
    </div>
  </div>
</template>

<script>
import Channel from "@/components/channels/Channel.vue";

export default {
  data() {
    return {
      channels: []
    };
  },
  components: {
    Channel
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
          lastMessage: `Message ${i}`,
        };
        this.channels.push(newChannel);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.channels {
  overflow-y: auto;
  height: 100%;
}
</style>
