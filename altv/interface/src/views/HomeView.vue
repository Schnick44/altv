<script setup lang="ts">
import type EventObserver from "@/observer";
</script>

<template>
  <div class="core">
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
  @include fill-parent;
  @include wrapper-center;
  .wrapper {
    @include default-preset;
  }
}
</style>
