import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.logIn({ email, password }); // Directly return login attempt if account is created
      }
    } catch (error) {
      console.error("Error creating account: ", error); // Better error handling
      throw error;
    }
  }

  async logIn({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      // console.error("Error logging in: ", error);
      console.log("Appwrite serive :: getCurrentUser :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite serive :: getCurrentUser :: error", error);
      throw error;
    }
  }

  async logOut() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
