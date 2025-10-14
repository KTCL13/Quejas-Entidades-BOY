"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const entitiesToSeed = [
      { name: "Secretaría De Educación De Boyacá" },
      { name: "Secretaría de Ambiente y Desarrollo Sostenible" },
      { name: "Sistema de Atención al Ciudadano" },
      { name: "Secretaría de Planeación" },
      { name: "Secretaría de TIC y Gobierno Abierto" },
    ];

    const entityNames = entitiesToSeed.map((e) => e.name);

    const existingEntities = await queryInterface.sequelize.query(
      `SELECT name FROM entities WHERE name IN (:names)`,
      {
        replacements: { names: entityNames },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const existingEntityNames = existingEntities.map((e) => e.name);

    const entitiesToInsert = entitiesToSeed.filter(
      (entity) => !existingEntityNames.includes(entity.name)
    );

    if (entitiesToInsert.length > 0) {
      await queryInterface.bulkInsert("entities", entitiesToInsert, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("entities", null, {});
  },
};
