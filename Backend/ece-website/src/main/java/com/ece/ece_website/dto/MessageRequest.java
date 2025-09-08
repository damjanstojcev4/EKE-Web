package com.ece.ece_website.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private String name;
    private String email;
    private String message;
}
