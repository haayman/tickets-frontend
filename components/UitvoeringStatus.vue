<template>
  <span>
    <span
      v-if="uitvoering.vrije_plaatsen"
    >{{uitvoering.vrije_plaatsen}} vrije plaats{{uitvoering.vrije_plaatsen == 1?'':'en'}}</span>
    <b v-else>Uitverkocht</b>
    <span
      v-if="!uitvoering.vrije_plaatsen || uitvoering.wachtlijst"
    >wachtlijst: {{uitvoering.wachtlijst}}</span>
    <span v-if="uitvoering.tekoop">te koop: {{uitvoering.tekoop}}</span>
    <span v-if="!uitvoering.verkoopbaar">(gesloten)</span>
  </span>
</template>

<script>
export default {
  props: ['uitvoering']
};
</script>
