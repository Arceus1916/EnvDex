import Realm from 'realm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../database/schema';

export class AuthService {
  /**
   * Generates a unique 6-character Hash ID
   */
  static generateHashId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = '';
    for (let i = 0; i < 6; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  /**
   * Creates a new local user
   */
  static async signup(
    realm: Realm,
    {
      fullName,
      username,
      passwordHash,
      categoryTag,
      customHashId,
    }: {
      fullName?: string;
      username: string;
      passwordHash: string; // MVP: simple local hash or plain string storage since it's local
      categoryTag?: string;
      customHashId?: string;
    }
  ): Promise<User> {
    const hashId = customHashId || this.generateHashId();

    // Check for existing hashId
    const existingUser = realm.objects(User).filtered('hashId == $0', hashId);
    if (existingUser.length > 0) {
      throw new Error('Hash ID already exists. Please generate a new one.');
    }

    let newUser!: User;
    realm.write(() => {
      newUser = realm.create(User, {
        userId: uuidv4(),
        hashId,
        fullName,
        username,
        passwordHash,
        categoryTag,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return newUser;
  }

  /**
   * Authenticates a user locally
   */
  static login(
    realm: Realm,
    { hashId, passwordHash }: { hashId: string; passwordHash: string }
  ): User | null {
    const users = realm.objects(User).filtered('hashId == $0 AND passwordHash == $1', hashId, passwordHash);
    
    if (users.length === 0) {
      throw new Error('Invalid Hash ID or password.');
    }
    
    return users[0];
  }
}
