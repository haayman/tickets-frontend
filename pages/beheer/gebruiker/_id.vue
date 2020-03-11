<template>
  <div class="py-3">
    <div class="alert alert-danger" v-if="errors['general']">
      {{ errors.general }}
    </div>
    <form @submit.prevent="save" class="{saving:user.saving}">
      <div class="form-group">
        {{ user.username }}
      </div>
      <div class="form-group">
        <div class="alert alert-danger" v-if="errors['name']">
          {{ errors.name }}
        </div>
        <label for="user-name">Naam</label>
        <input
          id="user-name"
          v-model="user.name"
          type="text"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <div class="alert alert-danger" v-if="errors['email']">
          {{ errors.email }}
        </div>
        <label for="user-phone">E-mail</label>
        <input
          id="user-phone"
          v-model="user.email"
          type="email"
          required
          class="form-control"
        />
      </div>
      <!--<div class="form-group">-->
      <!--<div class="alert alert-danger" v-if="errors['password']">{{ errors.password }}</div>-->
      <!--<label for="password">Wachtwoord</label>-->
      <!--<input-->
      <!--id="password"-->
      <!--v-model="user.password"-->
      <!--:type="passwordType"-->
      <!--class="form-control">-->

      <!--<label>Toon wachtwoord <input type="checkbox" @click="togglePassword()"/></label>-->
      <!--</div>-->

      <div class="form-group" v-if="isAdmin">
        <div class="alert alert-danger" v-if="errors['role']">
          {{ errors.role }}
        </div>
        <label
          >Rol
          <select class="form-control" v-model="user.role">
            <option v-for="role in roles" v-bind:value="role.id" :key="role.id">
              {{ role.description }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-group" v-else>
        <label>Role</label>
        <input readonly class="readonly" v-bind="user.role" />
      </div>
      <button type="submit" class="btn btn-primary">
        Bijwerken
      </button>
      <router-link :to="{ name: 'users-list' }" class="btn btn-secondary">
        annuleren
      </router-link>
    </form>
  </div>
</template>

<script>
import { User } from '~/models/User'
import { RoleList } from '~/models/Role'
import { mapGetters } from 'vuex'

export default {
  name: 'UsersEdit',
  data() {
    return {
      roles: RoleList,
      errors: {},
      passwordType: 'password'
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    user() {
      return User.find(this.$route.params.id)
    }
  },

  watch: {
    $route: 'get'
  },

  methods: {
    async save() {
      this.user
        .save()
        .then(() => {
          this.$router.push({
            path: '.'
          })
        })
        .catch(error => {
          let errors = error.errors || {}

          if (error.message) {
            errors.general = error.message
          }
          this.errors = errors
        })
    },

    togglePassword() {
      this.passwordType = this.passwordType == 'password' ? 'text' : 'password'
    }
  }
}
</script>
