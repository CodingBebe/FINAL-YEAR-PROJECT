"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Risk extends sequelize_1.Model {
}
Risk.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: sequelize_1.DataTypes.STRING,
    riskId: {
        type: sequelize_1.DataTypes.STRING,
        field: 'risk_id',
    },
    strategicObjective: {
        type: sequelize_1.DataTypes.STRING,
        field: 'strategic_objective',
    },
    description: sequelize_1.DataTypes.TEXT,
    principalOwner: {
        type: sequelize_1.DataTypes.STRING,
        field: 'principal_owner',
    },
    supportingOwners: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        field: 'supporting_owners',
    },
    category: sequelize_1.DataTypes.STRING,
    likelihood: sequelize_1.DataTypes.STRING,
    impact: sequelize_1.DataTypes.STRING,
    causes: sequelize_1.DataTypes.TEXT,
    consequences: sequelize_1.DataTypes.TEXT,
    existingControls: {
        type: sequelize_1.DataTypes.TEXT,
        field: 'existing_controls',
    },
    proposedMitigation: {
        type: sequelize_1.DataTypes.TEXT,
        field: 'proposed_mitigation',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'updated_at',
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Risk',
    tableName: 'risks',
    underscored: true,
    timestamps: true,
});
exports.default = Risk;
