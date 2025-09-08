package com.ece.ece_website.controller;

import com.ece.ece_website.dto.MessageRequest;
import com.ece.ece_website.entity.Contact;
import com.ece.ece_website.service.ContactService;
import com.ece.ece_website.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class ContactController {

    @Autowired
    private ContactService contactService;
    @Autowired
    private MailService mailService;

    @GetMapping("/")
    List<Contact> getAllContacts() {
        return contactService.findAll();
    }

    @PostMapping("/")
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        contactService.save(contact);

        mailService.sendMail(
                "New Message From: " + contact.getFullName(),
                "Email: " + contact.getEmail() +
                        "\n Message: \n " + contact.getYourMessage(),
                "damjan.stojcev4@gmail.com"
        );

        return ResponseEntity.ok(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteMessage(id);

        return ResponseEntity.noContent().build();
    }
}
