package com.example.security;

import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    /**
     * Username 조회 후 UsersEntity 반환
     * @param username String
     * @return new CustomUserDetails(userData) UserDetails
     * @throws UsernameNotFoundException e
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsersEntity userData = usersRepository.findByUsername(username);

        if(userData != null) {
            return new CustomUserDetails(userData);
        }

        System.out.println("user 정보 DB에 없다.");
        return null;
    }
}
