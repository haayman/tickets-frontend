<template>
  <v-expand-transition>
    <div v-if="loading" class="loader">
      <v-progress-circular v-bind="$attrs" indeterminate color="primary" size="40" />
      <slot />
    </div>
  </v-expand-transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style>
loader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0;
}
</style>
