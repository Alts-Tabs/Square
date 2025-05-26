package com.example.user.service;

import com.example.user.entity.UsersEntity;
import com.example.jwt.JwtUtil;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {
    private final JwtUtil jwtUtil;
    private final UsersRepository usersRepository;
    private final PasswordEncoder encoder;

    /**
     * 로그인 프로세스 - accessToken 반환
     * @param username String
     * @param password String
     * @return accessToken String
     */
    public String login(String username, String password) {
        UsersEntity user = usersRepository.findByUsername(username);
        if(user == null) {
            System.out.println("ID doesn't exist");
            return null;
        }

        if(!encoder.matches(password, user.getPassword())) {
            System.out.println("Invalid Password");
            return null;
        }

//        System.out.println(user.getName());

        return jwtUtil.createAccessToken(user);
    }

}
