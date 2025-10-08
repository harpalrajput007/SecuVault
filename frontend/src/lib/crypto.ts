import CryptoJS from 'crypto-js';

// Client-side encryption using AES with user's password as key
export class ClientCrypto {
  private static deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
  }

  static encrypt(plaintext: string, userPassword: string): string {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const key = this.deriveKey(userPassword, salt);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
    return salt + ':' + encrypted;
  }

  static decrypt(ciphertext: string, userPassword: string): string {
    const [salt, encrypted] = ciphertext.split(':');
    const key = this.deriveKey(userPassword, salt);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  static encryptVaultItem(item: any, userPassword: string) {
    return {
      ...item,
      title: this.encrypt(item.title, userPassword),
      username: this.encrypt(item.username, userPassword),
      password: this.encrypt(item.password, userPassword),
      url: item.url ? this.encrypt(item.url, userPassword) : '',
      notes: item.notes ? this.encrypt(item.notes, userPassword) : ''
    };
  }

  static decryptVaultItem(item: any, userPassword: string) {
    return {
      ...item,
      title: this.decrypt(item.title, userPassword),
      username: this.decrypt(item.username, userPassword),
      password: this.decrypt(item.password, userPassword),
      url: item.url ? this.decrypt(item.url, userPassword) : '',
      notes: item.notes ? this.decrypt(item.notes, userPassword) : ''
    };
  }
}