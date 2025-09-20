let entitiesCache = []

const setEntitiesCache = (data) => {
  entitiesCache = data
}

const getEntitiesCache = () => entitiesCache

module.exports = { setEntitiesCache, getEntitiesCache }