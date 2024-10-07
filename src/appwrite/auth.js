// import conf from "../conf/conf";
// import { Client, Account, ID } from "appwrite";

// export class AuthService {
//   client = new Client();
//   account;

//   constructor() {
//     this.client
//       .setEndpoint(conf.appwriteUrl)
//       .setProject(conf.appwriteProjectId);
//     this.account = new Account(this.client);
//   }

//   async createAccount({ email, password, name }) {
//     try {
//       const userAccount = await this.account.create(
//         ID.unique(),
//         email,
//         password,
//         name
//       );
//       if (userAccount) {
//         return this.logIn({ email, password }); // Directly return login attempt if account is created
//       } else {
//         return;
//       }
//     } catch (error) {
//       console.error("Error creating account: ", error); // Better error handling
//       throw error;
//     }
//   }

//   async logIn({ email, password }) {
//     try {
//       return await this.account.createEmailSession(email, password);
//     } catch (error) {
//       // console.error("Error logging in: ", error);
//       console.log("Appwrite serive :: getCurrentUser :: error", error);
//       throw error;
//     }
//   }

//   async getCurrentUser() {
//     try {
//       return await this.account.get();
//     } catch (error) {
//       console.log("Appwrite serive :: getCurrentUser :: error", error);
//       throw error;
//     }
//   }

//   async logOut() {
//     try {
//       await this.account.deleteSessions();
//     } catch (error) {
//       console.log("Appwrite service :: logout :: error", error);
//     }
//   }
// }

// const authService = new AuthService();

// export default authService;
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

  // Create account method with error handling for duplicate users
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(), // unique ID for the user
        email,
        password,
        name
      );

      if (userAccount) {
        // Account successfully created, now logging in the user
        return this.logIn({ email, password });
      } else {
        return;
      }
    } catch (error) {
      if (
        error.message.includes(
          "A user with the same id, email, or phone already exists"
        )
      ) {
        console.log("User already exists, logging in...");
        return this.logIn({ email, password }); // Log in if the user exists
      } else {
        console.error("Error creating account: ", error); // Log other errors
        throw error;
      }
    }
  }

  // Log in user
  async logIn({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password); // Create a session
    } catch (error) {
      console.log("Appwrite service :: logIn :: error", error); // Log login errors
      throw error;
    }
  }

  // Get current user session
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
      throw error;
    }
  }

  // Log out user
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
