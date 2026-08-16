package com.classconnect.service;

import com.classconnect.model.Notice;
import com.classconnect.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> findAll() {
        return noticeRepository.findAll();
    }

    public Optional<Notice> findById(String id) {
        return noticeRepository.findById(id);
    }

    public Notice save(Notice notice) {
        if (notice.getPostedAt() == null) {
            notice.setPostedAt(LocalDateTime.now());
        }
        return noticeRepository.save(notice);
    }

    public void deleteById(String id) {
        noticeRepository.deleteById(id);
    }
}
