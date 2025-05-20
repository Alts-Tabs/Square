package com.example.repository;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CodeUtil {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*";
    private static final String ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;

    private static final SecureRandom random = new SecureRandom();

    /**
     * 랜덤 코드 생성기(최소 6글자)
     * @param length int
     * @return randomCode String
     */
    public static String generateAcademyCode(int length) {
        List<Character> chars = new ArrayList<>();

        // 각 그룹에서 1개씩 반드시 포함
        chars.add(UPPERCASE.charAt(random.nextInt(UPPERCASE.length())));
        chars.add(LOWERCASE.charAt(random.nextInt(LOWERCASE.length())));
        chars.add(DIGITS.charAt(random.nextInt(DIGITS.length())));
        chars.add(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        // 나머지 랜덤 채우기
        for (int i = 4; i < length; i++) {
            chars.add(ALL_CHARACTERS.charAt(random.nextInt(ALL_CHARACTERS.length())));
        }

        // 순서 섞기
        Collections.shuffle(chars);

        StringBuilder code = new StringBuilder();
        for(char c: chars) {
            code.append(c);
        }

        return code.toString();
    }

}
