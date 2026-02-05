package com.papsnet.openissue.util;


import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.swing.*;
import java.security.DigestException;
import java.util.Base64;

public class EDecode extends JFrame {
	/**
	 * encrypt
	 * 알고리즘 AES-256
	 * [암호화]
	 */

	public static String encrypt(String encPwd) throws DigestException {

		if (encPwd == null || encPwd == "" || encPwd.length() < 1) {
			System.out.println("User_Password to Encrypt is null");
			return null;
		}

		PasswordDeriveBytes passbytes = new PasswordDeriveBytes("semskeycode",
				new byte[] {
						0x19,
						0x59,
						0x17,
						0x41
				});

		String alg = "AES/CBC/PKCS5Padding";
		// 키
		byte[] aesKey = passbytes.GetBytes(32); // 32byte
		byte[] aesIv = passbytes.GetBytes(16); // 16byte

		try {
			Cipher cipher = Cipher.getInstance(alg);

			// 키로 비밀키 생성
			SecretKeySpec keySpec = new SecretKeySpec(aesKey, "AES");
			// iv 로 spec 생성
			IvParameterSpec ivParamSpec = new IvParameterSpec(aesIv);
			// 암호화 적용
			cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParamSpec);

			// 암호화 실행
			byte[] encryptedPwd = cipher.doFinal(encPwd.getBytes("UTF-8"));
			encPwd = Base64.getEncoder().encodeToString(encryptedPwd); // 암호화 인코딩 후 저장

			System.out.println("Encrypted_Password: " + encPwd);
			return encPwd;
		} catch (Exception e) {
			System.out.println("암호화 중 오류 발생 ");
		}

		return null;
	}

	/**
	 * decrypt
	 * 알고리즘 AES-256
	 * [복호화]
	 */

	public void decrypt(String decPwd) throws DigestException {

		if (decPwd == null || decPwd == "" || decPwd.length() < 1) {
			System.out.println("User_Password to Decrypt is null");
			return;
		}

		PasswordDeriveBytes passbytes = new PasswordDeriveBytes("semskeycode",
				new byte[] {
						0x19,
						0x59,
						0x17,
						0x41
				});

		String alg = "AES/CBC/PKCS5Padding";
		// 키
		byte[] aesKey = passbytes.GetBytes(32); // 32byte
		byte[] aesIv = passbytes.GetBytes(16); // 16byte

		try {
			Cipher cipher = Cipher.getInstance(alg);

			SecretKeySpec keySpec = new SecretKeySpec(aesKey, "AES");
			IvParameterSpec ivParamSpec = new IvParameterSpec(aesIv);
			cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParamSpec);

			// 해석
			byte[] decodedBytes = Base64.getDecoder().decode(decPwd);
			byte[] decryptedPwd = cipher.doFinal(decodedBytes);
			String decPWD = new String(decryptedPwd);

			System.out.println("Decrypted_Password: " + decPWD);

		} catch (Exception e) {
			System.out.println("Decrypt Error, Wrong PDBKey");
		}
	}
}
