import CryptoJS from "crypto-js";

// const AES_ENCRYPT_KEY = "oingisprettyintheworld1234567890";
const encryptedData = {
  user_index: "OGl8W+WbOo/BLQ6lD+LxAkLsFjitF8i4Qb28MYMtiN0=",
  user_name: "KKafetOnd7IPN72asrqTp+qkTfDHOsVP3hKZcmey3Bc=",
  user_roletype_role_index: "vHx76aoV8Pd8Hed5sMj6fO+D8KoOs7d4xPclzI6FmHY=",
};

const IV = CryptoJS.enc.Utf8.parse("\0".repeat(16)); // Null IV as used in Python

export function decryptData(encryptedString) {
  const AES_ENCRYPT_KEY = "oingisprettyintheworld1234567890".slice(0, 32);
  try {
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedString);
    const bytes = CryptoJS.AES.decrypt(
      { ciphertext },
      CryptoJS.enc.Utf8.parse(AES_ENCRYPT_KEY),
      { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );
    return bytes.toString(CryptoJS.enc.Utf8); // Return the decrypted text
  } catch (error) {
    return null;
  }
}

console.log(decryptData("7diEXGdRCIKD5R8FsYxBPi/NMKhdZJH/UBDeWhQ+DOI="));
