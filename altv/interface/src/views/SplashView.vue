<script setup lang="ts">
import type EventObserver from "@/observer";
import { IClientToInterface } from "schnick";
</script>

<template>
  <div class="core">
    <div class="icon_wrapper">
      <fa icon="fa-duotone fa-gear" size="4x" />
    </div>
    <div class="text_wrapper">
      <div class="title">
        {{ stepData.title }}
      </div>
      <div class="description">
        {{ stepData.description }}
      </div>
    </div>
    <div class="progress_wrapper">
      <div class="bar" v-bind:style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<script lang="ts">
type StepArgs = IClientToInterface["SetSplashScreenStep"];

export default {
  name: "Login",
  inject: ["observer"],
  mounted: function () {
    const observer = this.observer as EventObserver;
    observer.add("GetInterfaceReady", () => observer.emit("SetInterfaceReady"));
    observer.add("SetSplashScreenStep", this.setStep);
    observer.add("SetClientReady", this.setClientReady);
    observer.add("OpenOAuthUrl", this.openOAuthUrl);
  },
  unmounted: function () {
    const observer = this.observer as EventObserver;
    observer.remove("SetSplashScreenStep");
    observer.remove("SetClientReady");
  },
  data: () => {
    return {
      step: 0,
      stepData: {
        title: "Lade...",
        description: "Warte auf Client",
      } as StepArgs[0],
      totalSteps: 1,
    };
  },
  computed: {
    progress() {
      return Math.min(Math.floor((this.step / this.totalSteps) * 100), 100);
    },
  },
  methods: {
    setStep(...args: StepArgs) {
      Object.assign(this.stepData, args[0]);
      this.step = args[1];
    },
    setClientReady(totalSteps: number) {
      this.totalSteps = totalSteps;
    },
    openOAuthUrl(url: string) {
      window.open(url);
    },
  },
};
</script>

<style lang="scss" scoped>
div.core {
  @include fill-parent;
  @include wrapper-center;
  @include default-font;
  background: $c-primary;
  color: $c-secondary;

  .icon_wrapper {
    > * {
      animation: rotation 3s infinite ease-in-out;
      --fa-secondary-opacity: 0;
    }
  }
  .text_wrapper {
    text-align: center;
    .title {
      font-weight: 700;
    }
    .description {
      max-width: 300px;
      min-height: 54px;
      word-wrap: break-word;
    }
  }

  .progress_wrapper {
    border-radius: 0.3rem;
    background-color: rgba(0, 0, 0, 0.25);
    height: 1rem;
    width: 300px;

    .bar {
      background: $c-secondary;
      height: 100%;
      border-radius: 0.3rem;
    }
  }
}
</style>
