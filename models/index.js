import VuexORM, { Model } from '@vuex-orm/core'

const database = new VuexORM.Database()

const fileModels = require.context('.', true, /\.js$/)

fileModels.keys().forEach(fileName => {
  if (fileName === './index.js') return

  const classOnModel = fileModels(fileName)

  for (const className in classOnModel) {
    if (classOnModel[className].prototype instanceof Model) {
      const vuexModule = classOnModel[`${classOnModel[className].name}Vuex`]
      if (vuexModule !== undefined) {
        database.register(classOnModel[className], vuexModule)
      } else {
        database.register(classOnModel[className])
      }
    }
  }
})
export default database
