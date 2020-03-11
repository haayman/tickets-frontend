<template>
  <div class="card mt-3" v-if="reserveringen.length">
    <div class="card-header">
      <slot></slot>
    </div>
    <div class="m-3 form-inline noprint">
      <input class="form-control" v-model="filter" placeholder="zoek" @focus="$event.target.select()">
      <div v-if="aantalIngenomen">{{aantalIngenomen}} van de {{totaalAantal}} ingenomen</div>
    </div>
    <table class="table table-responsive-md table-hover">
      <thead>
        <tr>
          <th></th>
          <th class="sortable" @click="setColumn('naam')">
            Naam
            <font-awesome-icon :icon="icon('naam')"></font-awesome-icon>
          </th>
          <th class="sortable" @click="setColumn('email')">
            E-mail
            <font-awesome-icon :icon="icon('email')"></font-awesome-icon>
          </th>
          <th v-if="!uitvoeringId">Voorstelling</th>
          <th class="sortable" @click="setColumn('createdAt')">
            Tijdstip
            <font-awesome-icon :icon="icon('createdAt')"></font-awesome-icon>
          </th>
          <th>Kaarten</th>
          <th class="sortable" @click="setColumn('status')">
            Status
            <font-awesome-icon :icon="icon('status')"></font-awesome-icon>
          </th>
          <th v-if="hasOpmerkingen">Opmerking</th>
          <th v-if="hasAantekeningen">Aantekeningen</th>
        </tr>
      </thead>
      <tbody>
        <router-link
          v-for="reservering in sorted"
          :key="reservering.id"
          :to="{name: 'reservering-details', params: { id: reservering.id}, query:{inBeheer:true}}"
          tag="tr"
          style="cursor:pointer;"
        >
          <td @click.prevent="ignore">
            <font-awesome-icon v-if="reservering.ingenomen" icon="check-square"></font-awesome-icon>
            <font-awesome-icon
              v-if="isAdministrator"
              icon="ticket-alt"
              @click.prevent="resend(reservering)"
              title="ticket opnieuw versturen"
            ></font-awesome-icon>
            <font-awesome-icon
              v-if="isAdministrator && reservering.openstaandBedrag > 0"
              icon="credit-card"
              @click.prevent="reminder(reservering)"
              title="betalingsverzoek versturen"
            ></font-awesome-icon>
          </td>
          <td>{{reservering.naam}}</td>
          <td>{{ reservering.email}}</td>
          <td v-if="!uitvoeringId">{{ reservering.uitvoering.toString()}}</td>
          <td>{{ reservering.createdAt|formatDate }}</td>
          <td class="d-flex flex-column">
            <span
              class="mr-3"
              v-for="ticket in reservering.tickets"
              :key="ticket.id"
            >{{ticket.aantal ? ticket.toString() : ''}}</span>
          </td>
          <td>{{reservering.status}}</td>
          <td v-if="hasOpmerkingen">{{reservering.opmerking_gebruiker}}</td>
          <td v-if="hasAantekeningen">{{reservering.opmerking}}</td>
        </router-link>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons/faTicketAlt';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons/faCreditCard';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { library } from '@fortawesome/fontawesome-svg-core';
import { UitvoeringList } from '../../../../models/Uitvoering';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTrash);
library.add(faSortDown);
library.add(faSortUp);
library.add(faSort);
library.add(faTicketAlt);
library.add(faCreditCard);
library.add(faCheckSquare);

export default {
  name: 'Reserveringen',
  props: ['reserveringen', 'uitvoeringId'],
  data() {
    return {
      sortColumn: 'createdAt',
      ascending: false,
      filter: ''
    };
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    ...mapGetters(['activeUser']),
    hasOpmerkingen: function() {
      return this.reserveringen.find((r) => r.opmerking_gebruiker);
    },
    hasAantekeningen: function() {
      return this.reserveringen.find((r) => r.opmerking);
    },

    isAdministrator() {
      return this.activeUser && this.activeUser.isAdministrator();
    },

    totaalAantal() {
      return this.reserveringen.reduce(
        (totaal, reservering) => totaal + reservering.aantal,
        0
      );
    },

    aantalIngenomen() {
      return this.reserveringen
        .filter((r) => r.ingenomen)
        .reduce((totaal, reservering) => totaal + reservering.aantal, 0);
    },

    /**
     * reserveringen gesorteerd op this.sortColumn/this.ascending
     */
    sorted() {
      const sort = (a, b) => {
        const cmp = (a, b) => {
          // dit werkt zowel op strings/getallen/datums
          return (
            (a[this.sortColumn] > b[this.sortColumn]) -
            (a[this.sortColumn] < b[this.sortColumn])
          );
        };

        if (this.ascending) {
          return cmp(a, b);
        } else {
          return cmp(b, a);
        }
      };
      let retval = this.reserveringen.sort(sort);

      // ook filteren
      retval = retval.filter((reservering) => {
        if (!this.filter) {
          return true;
        }
        const re = new RegExp(this.filter, 'i'); // case insensitive
        return reservering.email.match(re) || reservering.naam.match(re);
      });
      return retval;
    }
  },
  methods: {
    remove(reservering) {
      if (confirm('Weet je zeker dat je deze reservering wilt verwijderen')) {
        reservering.delete();
      }
    },
    order(column) {
      return this.sortColumn == column;
    },
    icon(column) {
      if (!this.order(column)) {
        return faSort;
      } else {
        return this.ascending ? faSortDown : faSortUp;
      }
    },

    setColumn(column) {
      if (this.sortColumn == column) {
        this.ascending = !this.ascending;
      } else {
        this.sortColumn = column;
      }
    },

    reminder(reservering) {
      fetch(`/api/reservering/${reservering.id}/resend`).then(() => {
        this.$notify({
          text: `Betalingsherinnering ${reservering.email} verzonden`
        });
      });
    },

    resend(reservering) {
      fetch(`/api/reservering/${reservering.id}/resend`).then(() => {
        this.$notify({ text: `Ticket ${reservering.email} verzonden` });
      });
    },

    ignore() {
      // nothing
    }
  }
};
</script>
<style scoped>
.sortable {
  cursor: pointer;
}
th {
  white-space: nowrap;
}
</style>
