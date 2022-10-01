interface iModel {
  email_address: string;
  id: string;
  role: string;
}

module.exports = class UserDto {
  email;
  id;
  role;

  constructor(model: iModel) {
    this.email = model.email_address;
    this.id = model.id;
    this.role = model.role;
  }
};
