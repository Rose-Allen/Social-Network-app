const sequelize = require("../db");
const { DataTypes } = require("sequelize");

interface IUser {
  id: number;
  email_address: string;
  password: string;
  country: string;
  date_of_birth: string;
  given_name: string;
  surname: string;
  role?: string;
}

const User: IUser = sequelize.define("user_profile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email_address: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  given_name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "User" },
});

const PostLike = sequelize.define("post_like", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserPost = sequelize.define("user_post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  written_text: { type: DataTypes.STRING },
  media_location: { type: DataTypes.STRING },
});

const PostComment = sequelize.define("post_comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  written_text: { type: DataTypes.STRING },
  media_location: { type: DataTypes.STRING },
});

const FriendShip = sequelize.define("friendship", {});

User.hasOne(Bascket);
Bascket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Bascket.hasMany(BascketDevice);
BascketDevice.belongsTo(Bascket);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BascketDevice);
BascketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo);
DeviceInfo.belongsTo(Device);

Type.hasMany(Device);
Device.belongsTo(Type);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

Device.hasMany(DeviceInfo);
DeviceInfo.belongsTo(Device);

module.exports = {
  User,
};
