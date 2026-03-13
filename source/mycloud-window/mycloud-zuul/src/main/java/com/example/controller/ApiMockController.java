package com.example.controller;

import com.example.common.utils.R;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiMockController {

    @RequestMapping("/{name}")
    public R mockData(@PathVariable String name) {
        if ("createShareUrl".equals(name)) {
            String mockShareUrl = "http://127.0.0.1:8045/#/share/abcdefg12345";
            return R.ok().put("data", mockShareUrl);
        }
        return R.ok().put("data", "");
    }
}