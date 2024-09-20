import { DataTypes, Model, Association, Sequelize } from 'sequelize';
import { DesignStatus } from '../../shared/types';
import { User } from './User';
import { Product } from './Product';

class Design extends Model {
  public id!: string;
  public userId!: string;
  public productId!: string;
  public name!: string;
  public designParameters!: object;
  public imageUrl!: string;
  public status!: DesignStatus;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public static associations: {
    user: Association<Design, User>;
    product: Association<Design, Product>;
  };

  public static associate(models: { User: typeof User; Product: typeof Product }) {
    Design.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Design.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

export const initDesign = (sequelize: Sequelize): typeof Design => {
  Design.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designParameters: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DesignStatus)),
        allowNull: false,
        defaultValue: DesignStatus.DRAFT,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Design',
      tableName: 'designs',
    }
  );

  return Design;
};

export default Design;