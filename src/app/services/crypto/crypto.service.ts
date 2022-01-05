import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/* https://www.code-sample.com/2019/10/angular-10-9-8-7-password-encryption.html */

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() { }

  encrypt(encryptionKey: string, value: string): string {
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);
    const iv = CryptoJS.enc.Utf8.parse(encryptionKey);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  decrypt(encryptionKey: string, encryptedValue: string): string {
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);
    const iv = CryptoJS.enc.Utf8.parse(encryptionKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}