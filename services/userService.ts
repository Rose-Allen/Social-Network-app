class UserService {
  register = async (
    email: string,
    name: string,
    password: string
  ): Promise<string> => {
    const user = "test";
    return user;
  };

  login = async (): Promise<void> => {};

  logout = async (): Promise<void> => {};

  checkAuth = async (): Promise<void> => {};
}

module.exports = new UserService();
