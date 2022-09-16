const { UserPost } = require("../models/model");
const sequelize = require("../db");

class PostService {
  create = async (
    userId: string,
    text: string,
    media: string
  ): Promise<string> => {
    const t = await sequelize.transaction();

    try {
      const user = await UserPost.create(
        {
          userProfileId: userId,
          written_text: text,
          media_location: media,
        },
        { transaction: t }
      );

      await t.commit();
      return user;
    } catch (e) {
      await t.rollback();
      if (e) {
        throw new Error("Bad request");
      }
      return "";
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
}

module.exports = new PostService();
