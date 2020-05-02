import VuexORM, { Model } from "@vuex-orm/core";
import VuexORMisDirtyPlugin from "@vuex-orm/plugin-change-flags";

export default ({ $axios }) => {
  Model.setAxios($axios);

  VuexORM.use(VuexORMisDirtyPlugin);
};
