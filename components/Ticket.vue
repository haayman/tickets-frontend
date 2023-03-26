<template>
  <tr v-if="shouldBeDisplayed">
    <td>
      <Prijs :prijs="ticket.prijs" />
    </td>

    <td>
      <ticket-amount v-model="aantal" :max="max" />
    </td>

    <td>
      <ticket-saldo :ticket="ticket" />
    </td>
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

/**
 * is de huidige gebruiker gemachtigd deze prijs te bestellen?
 */
const isAuthorized = computed(() => {
  return !props.ticket.prijs.role || userIsAuthorized(props.ticket.prijs.role);
});

/**
 * een anonieme gebruiker kan z'n eigen vrijkaartjes zien
 */
const shouldBeDisplayed = computed(() => isAuthorized.value || originalAantal.value);

const max = computed(() => {
  if (props.ticket.prijs.prijs > 0 || isAuthorized.value) return 8;

  // iemand die de eigen vrijkaartjes aanpast kan alleen omlaag
  return originalAantal.value;
});

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
