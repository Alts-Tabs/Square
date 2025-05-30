package com.example.user.service;

import com.example.user.jpa.ParentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final ParentsRepository parentsRepository;

    /** userId로 parentId 얻기 - 종합평가페이지에서 사용 */
    public int getParentIdByUserId(int userId){
        return parentsRepository.findByUserUserId(userId).get().getParentId();
    }


}
