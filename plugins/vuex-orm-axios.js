import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM, { Model } from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import VuexORMDatabase from '@/models/index.js'
import datePlugin from 'vuex-orm-plugin-date-attribute'

Vue.use(Vuex)
VuexORM.use(VuexORMAxios)
VuexORM.use(datePlugin)

export default ({ $axios, store }) => {
  Model.setAxios($axios)
  VuexORM.install(VuexORMDatabase)(store)
}
