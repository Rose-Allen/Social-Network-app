const { UserPost, User } = require("../models/model");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const ApiError = require("../error/ApiError");
const aws = require("../s3");
const sequelize = require("../db");
const redisClient = require("../caching");

class PostService {
  create = async (
    userId: string,
    text: string,
    media: any
  ): Promise<Object> => {
    const t = await sequelize.transaction();

    try {
      const fileName = uuid.v4() + ".jpg";

      fs.mkdirSync(path.resolve(__dirname, "..", "static"), {
        recursive: true,
      });
      await media.mv(path.resolve(__dirname, "..", "static", fileName));

      const result = await aws.uploadFile({
        ...media,
        path: path.join("static", fileName),
        filename: fileName,
      });

      fs.unlink(path.resolve(__dirname, "..", "static", fileName), () => {
        console.log("deleted");
      });

      const postData = await UserPost.create(
        {
          userProfileId: userId,
          written_text: text,
          media_location: result.Key,
        },
        { transaction: t }
      );

      await t.commit();

      return { ...postData.dataValues, media: `/images/${result.Key}` };
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };

  getAllPosts = async (): Promise<Object> => {
    const t = await sequelize.transaction();
    let isCached = false;

    try {
      const cacheResults = await redisClient.get("getAll");
      if (cacheResults) {
        isCached = true;
        const posts = JSON.parse(cacheResults);
        await redisClient.set("getAll", JSON.stringify(posts));
        console.log("s");
        return { isCached, ...posts };
      } else {
        const posts = await UserPost.findAndCountAll(
          {
            include: [
              {
                model: User,
                attributes: ["email_address", "date_of_birth"],
                required: false, // will create a left join
              },
            ],
          },
          { transaction: t }
        );
        if (posts.length === 0) {
          throw "API returned an empty array";
        }
        await redisClient.set("getAll", JSON.stringify(posts));
        console.log("s");
        await t.commit();
        return { isCached, ...posts };
      }
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };

  remove = async (id: string): Promise<Object> => {
    const t = await sequelize.transaction();

    try {
      const post = await UserPost.findOne(
        { where: { id } },
        { transaction: t }
      );

      await aws.deleteFileStream(post.dataValues.media_location);
      await UserPost.destroy({ where: { id } });

      await t.commit();

      return post;
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };

  edit = async (id: string, text: string, media: any): Promise<Object> => {
    const t = await sequelize.transaction();

    try {
      const fileName = uuid.v4() + ".jpg";

      fs.mkdirSync(path.resolve(__dirname, "..", "static"), {
        recursive: true,
      });
      await media.mv(path.resolve(__dirname, "..", "static", fileName));

      const prevPost = await UserPost.findOne(
        { where: { id } },
        { transaction: t }
      );

      console.log(prevPost);

      const result = await aws.editFileStream(
        prevPost.dataValues.media_location,
        {
          ...media,
          path: path.join("static", fileName),
          filename: fileName,
        }
      );

      fs.unlink(path.resolve(__dirname, "..", "static", fileName), () => {
        console.log("deleted");
      });

      const postData = await UserPost.update(
        {
          written_text: text,
          media_location: result.Key,
        },
        {
          where: {
            id,
          },
          returning: true,
        },
        { transaction: t }
      );

      await t.commit();

      return postData;
    } catch (e) {
      await t.rollback();
      console.log(e);
      if (e) {
        throw ApiError.badRequest("Неверный запрос");
      }
      return {};
    }
  };
}

module.exports = new PostService();

export {};
