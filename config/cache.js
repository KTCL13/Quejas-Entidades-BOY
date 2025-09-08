let entidadesCache = []

const setEntidadesCache = (data) => {
  entidadesCache = data
}

const getEntidadesCache = () => entidadesCache

module.exports = { setEntidadesCache, getEntidadesCache }