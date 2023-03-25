<template>
  <tr v-if="shouldBeDisplayed">
    <td>{{ ticket.prijs.description }}</td>

    <td class="money">{{ formatMoney(ticket.prijs.prijs) }}</td>

    <td>
      <ticket-amount v-model="aantal" :max="8" />
    </td>

    <td v-if="aantalTekoop">{{ ticket.aantalTekoop }}</td>

    <td v-if="reservering.id" class="text-center">{{ formatMoney(ticket.betaald) }}</td>

    <td class="money text-center">{{ formatMoney(factor * ticket.tebetalen) }}</td>
  </tr>
</template>

<script setup lang="ts">
import { Reservering, Ticket } from "~~/models";
import { Rule } from "~~/types/rule";

const props = defineProps<{
  ticket: Ticket;
  reservering: Reservering;
  aantalTekoop: number;
  aantal: number;
  factor: number;
  rules: Rule[];
}>();

const emit = defineEmits<{
  (event: "update:aantalTekoop", value: number): void;
  (event: "update:aantal", value: number): void;
}>();

const aantalTekoop = useVModel(props, "aantalTekoop", emit);

const originalAantal = ref<number>(props.ticket.aantal - props.ticket.aantalTekoop);
const originalTekoop = ref<number>(props.ticket.aantalTekoop);
const { isAuthorized: userIsAuthorized } = useAuth();

const isAuthorized = computed(() => {
  return !props.ticket.prijs.role || userIsAuthorized(props.ticket.prijs.role);
});

const shouldBeDisplayed = computed(() => isAuthorized.value || originalAantal.value);

const aantal = computed({
  get() {
    return Math.max(props.ticket.aantal - props.ticket.aantalTekoop);
  },
  set(value) {
    if (originalTekoop.value) {
      // eslint-disable-next-line vue/no-mutating-props
      props.ticket.aantalTekoop = Math.max(originalTekoop.value + originalAantal.value - value, 0);
    }
    // eslint-disable-next-line vue/no-mutating-props
    props.ticket.aantal = value + props.ticket.aantalTekoop;
    // this.$emit("change", this.aantal);

    // emit("update:aantal", value + props.ticket.aantalTekoop);
  },
});
</script>
