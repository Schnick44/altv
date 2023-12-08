<script setup lang="ts">
import { RouterView } from "vue-router";
import StaticView from "./views/StaticView.vue";
import Notification from "./components/Notification.vue";
</script>

<template>
  <main>
    <Notification />
    <StaticView />
    <RouterView />
  </main>
</template>

<script lang="ts">
export default {
  mounted: function () {
    this.$router.push("/splash");
  },
};
</script>
