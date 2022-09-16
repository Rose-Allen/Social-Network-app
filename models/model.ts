import { ModelStatic } from "sequelize";
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User: ModelStatic<any> = sequelize.define("user_profile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email_address: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  given_name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "User" },
});

const PostLike: ModelStatic<any> = sequelize.define("post_like", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const UserPost: ModelStatic<any> = sequelize.define("user_post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  written_text: { type: DataTypes.STRING },
  media_location: { type: DataTypes.STRING },
});

const PostComment: ModelStatic<any> = sequelize.define("post_comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  written_text: { type: DataTypes.STRING },
  media_location: { type: DataTypes.STRING },
});

const FriendShip: ModelStatic<any> = sequelize.define("friendship", {});

User.hasMany(PostLike);
PostLike.belongsTo(User);

User.hasMany(UserPost);
UserPost.belongsTo(User);

UserPost.hasMany(PostLike);
PostLike.belongsTo(UserPost);

UserPost.hasMany(PostComment);
PostComment.belongsTo(UserPost);

User.hasMany(PostComment);
PostComment.belongsTo(User);

User.belongsToMany(User, {
  as: "profile_request",
  foreignKey: "ProfileRequest",
  through: FriendShip,
});
User.belongsToMany(User, {
  as: "profile_accept",
  foreignKey: "ProfileAccept",
  through: FriendShip,
});

module.exports = {
  User,
  PostLike,
  PostComment,
  UserPost,
  FriendShip,
};
