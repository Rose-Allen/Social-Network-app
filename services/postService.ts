const { UserPost, User } = require("../models/model");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const aws = require("../s3");
const sequelize = require("../db");

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
      if (e) {
        throw new Error("Bad request");
      }
      return {};
    }
    // const user = await User.create({
    //   email_address: "lifergamerus@gmail.com",
    //   password: "asdasdas",
    //   country: "wakanda",
    //   date_of_birth: "2003-07-30",
    //   given_name: "fortuna",
    //   surname: "sabi",
    // });
  };

  getAllPosts = async (): Promise<Object> => {
    const t = await sequelize.transaction();

    try {
      const posts = await UserPost.findAll(
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

      await t.commit();

      return posts;
    } catch (e) {
      await t.rollback();
      if (e) {
        throw new Error("Bad request");
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
      if (e) {
        throw new Error("Bad request");
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
      if (e) {
        throw new Error("Bad request");
      }
      return {};
    }
  };
}

module.exports = new PostService();

export {};
