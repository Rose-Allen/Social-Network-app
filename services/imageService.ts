const { UserPost } = require("../models/model");
const aws = require("../s3");
const sequelize = require("../db");

class imageService {
  getImage = async (id: string): Promise<any> => {
    const t = await sequelize.transaction();

    try {
      const post = await UserPost.findOne(
        { where: { id } },
        { transaction: t }
      );

      const result = await aws.getFileStream(post.dataValues.media_location);

      await t.commit();

      return result;
    } catch (e) {
      await t.rollback();
      if (e) {
        throw new Error("Bad request");
      }
      return {};
    }
  };
}

module.exports = new imageService();

export {};
