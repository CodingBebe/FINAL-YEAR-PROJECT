import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define TypeScript interface for Risk attributes
interface RiskAttributes {
  id: string;
  title: string;
  riskId?: string;
  strategicObjective: string; 
  description?: string;
  principalOwner?: string;
  supportingOwners?: string[];
  category?: string;
  likelihood?: string;
  impact?: string;
  causes?: string;
  consequences?: string;
  existingControls?: string;
  proposedMitigation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Allow optional fields when creating
interface RiskCreationAttributes extends Optional<RiskAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Risk extends Model<RiskAttributes, RiskCreationAttributes> implements RiskAttributes {
  public id!: string;
  public title!: string;
  public riskId!: string;
  public strategicObjective!: string;
  public description!: string;
  public principalOwner!: string;
  public supportingOwners!: string[];
  public category!: string;
  public likelihood!: string;
  public impact!: string;
  public causes!: string;
  public consequences!: string;
  public existingControls!: string;
  public proposedMitigation!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Risk.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    riskId: {
      type: DataTypes.STRING,
      field: 'risk_id',
    },
    strategicObjective: {
  type: DataTypes.STRING,
  field: 'strategic_objective',
},

    description: DataTypes.TEXT,
    principalOwner: {
      type: DataTypes.STRING,
      field: 'principal_owner',
    },
    supportingOwners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      field: 'supporting_owners',
    },
    category: DataTypes.STRING,
    likelihood: DataTypes.STRING,
    impact: DataTypes.STRING,
    causes: DataTypes.TEXT,
    consequences: DataTypes.TEXT,
    existingControls: {
      type: DataTypes.TEXT,
      field: 'existing_controls',
    },
    proposedMitigation: {
      type: DataTypes.TEXT,
      field: 'proposed_mitigation',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'Risk',
    tableName: 'risks',
    underscored: true,
    timestamps: true,
  }
);

export default Risk;