package com.classconnect.controller;

import com.classconnect.model.Notice;
import com.classconnect.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNotice(@PathVariable String id) {
        return noticeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        return noticeService.save(notice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable String id, @RequestBody Notice notice) {
        if (noticeService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        notice.setId(id);
        return ResponseEntity.ok(noticeService.save(notice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable String id) {
        noticeService.deleteById(id);
        return ResponseEntity.ok("Notice deleted successfully");
    }
}
