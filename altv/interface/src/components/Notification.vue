<script setup lang="ts">
import type EventObserver from "@/observer";
import type { IClientToInterface, Maybe } from "schnick";
</script>

<template>
  <div id="notification" :class="{ show, initiated }">
    <div class="top">
      <div class="type_display" :class="currentNotification.type" />
      <div class="text">
        <div class="top">{{ currentNotification.head }}</div>
        <div class="bot">{{ currentNotification.description }}</div>
      </div>
    </div>
    <div class="bottom" v-if="action.type">
      <div class="progress">
        <div v-bind:style="{ width: `${action.progress}%` }" />
      </div>
      <div class="text">
        Halte <span class="key">X</span>
        {{ currentNotification.bottomText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
type args = IClientToInterface["Notification"][0];
enum NotificationActionType {
  CopyMessage = "copy",
}

export default {
  name: "Notification",
  inject: ["observer"],
  mounted: function () {
    const observer = this.observer as EventObserver;
    observer.add("Notification", (arg) => this.add(arg));
    observer.add("KeydownX", (isKeydown) => this.toggleAction(isKeydown));
  },
  unmounted: function () {
    const observer = this.observer as EventObserver;
    observer.remove("Notification");
    observer.remove("KeydownX");
  },
  data: () => {
    return {
      initiated: false,
      show: false,
      queue: [] as args[],
      timeout: undefined as Maybe<NodeJS.Timeout>,
      currentNotification: {
        type: "notification" as args["type"],
        head: "",
        description: "",
        action: undefined,
        bottomText: undefined,
      } as args & { bottomText?: string },
      action: {
        type: undefined as Maybe<NotificationActionType>,
        onResolve: () => {},
        progress: 0,
      },
    };
  },
  methods: {
    add(arg: args) {
      // Check if the same message is currently displayed
      if (
        this.currentNotification.head == arg.head &&
        this.currentNotification.description == arg.description
      )
        return;
      // Check if the same properties already exist in the queue
      if (
        this.queue.find((e) => {
          return e.head == arg.head && e.description == arg.description;
        })
      )
        return;

      this.queue.push(arg);
      if (this.timeout === undefined) this.showNext();
    },
    showNext() {
      this.initiated = true;
      if (this.queue.length === 0) return;
      this.show = true;
      this.timeout = setTimeout(this.hideCurrent, 6000);
      this.currentNotification = this.queue.shift() as args;
    },
    hideCurrent() {
      this.show = false;
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.clearCurrent();
        this.showNext();
      }, 2e3);
    },
    clearCurrent() {
      this.currentNotification = {
        head: "",
        description: "",
        type: "notification",
        action: undefined,
      };
    },
    toggleAction(t: boolean) {
      t;
    },
  },
};
</script>

<style lang="scss" scoped>
#notification {
  position: absolute;
  top: 1rem;
  left: 1rem;
  min-width: 300px;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  &:not(.resolved, .show) {
    @include anim-slide-out-top;
  }
  &:not(.show).resolved {
    @include anim-slide-out-top-tweaked;
  }
  &.resolved:not(.hide) {
    @include anim-slide-right;
  }
  &.show {
    @include anim-slide-in-top;
  }
  &.initiated {
    display: block;
  }
  &:not(.initiated) {
    display: none;
  }
  > .top {
    border-radius: 12px;
    background-color: $c-secondary;
    backface-visibility: hidden;
    @include default-box-shadow(6px, $c-secondary);

    position: relative;

    display: flex;
    gap: 10px;
    padding: 10px;

    .type_display {
      align-self: stretch;
      border-radius: 4px;
      padding: 2px;
      &.notification {
        background: white;
      }
      &.info {
        background: #4f9bff;
      }
      &.warning {
        background: #ff5900;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      > * {
        @include default-font;
        padding: 6px;
        color: $c-accentual1;
        font-size: 20px;
        line-height: 20px;
      }
      > .top {
        font-weight: 700;
      }
    }
  }
  > .bottom {
    > .progress {
      height: 4px;
      background-color: $c-accentual2;
      border-radius: 2px;
      > div {
        height: 100%;
        border-radius: 2px;
        background-color: $c-primary;
      }
    }
    > .text {
      font-family: PL;
      color: $c-accentual1;
      height: 36px;
      padding: 4px 10px;
      text-align: center;
      > span {
        font-family: MR;
        display: inline-block;
        line-height: 24px;
        width: 24px;
        height: 24px;
        margin: 0 5px;
        background-color: $c-accentual1;
        @include default-box-shadow(6px, $c-accentual2);
        font-weight: 900;
        color: $c-accentual2;
        border-radius: 5px;
      }
    }
  }
}
</style>
