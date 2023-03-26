<template>
  <div class="voorstelling_date">
    <div class="date">
      <div class="month">{{ formatDate(min, "MMM") }}</div>
      <div class="day">{{ formatDate(min, "dd") }}</div>
    </div>
    <template v-if="!equal">
      <div>-</div>
      <div class="date">
        <div class="month">{{ formatDate(max, "MMM") }}</div>
        <div class="day">{{ formatDate(max, "dd") }}</div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ min: Date; max: Date }>();
const equal = computed(() => props.min.getTime() === props.max.getTime());
</script>

<style lang="scss">
.voorstelling_date {
  .month {
    font-size: larger;
    text-transform: uppercase;
  }
  .day {
    font-size: large;
    font-weight: bolder;
  }
}
</style>
