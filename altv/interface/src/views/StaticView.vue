<script setup lang="ts">
import type EventObserver from "@/observer";
</script>

<template>
  <div id="static">
    <div class="wrapper" v-bind:class="{ hide: isHidden }"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Login",
  inject: ["observer"],
  mounted: function () {
    const observer = this.observer as EventObserver;
    observer;
  },
  unmounted: function () {
    const observer = this.observer as EventObserver;
    observer;
  },
  data: () => {
    return {
      isHidden: false,
    };
  },
};
</script>

<style lang="scss" scoped>
div.core {
  position: absolute;
}
</style>
