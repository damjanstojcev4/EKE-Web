package com.ece.ece_website.service;

import com.ece.ece_website.entity.Contact;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class MailService {
    @Autowired
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${mail.from.name:ECE Website}") // optional default friendly name
    private String fromName;

    public void sendContactEmail(Contact contact, String recipient) {
        String subject = (contact.getSubject() != null && !contact.getSubject().isBlank())
                ? contact.getSubject()
                : "New Contact Message";

        String body = "Name: " + contact.getFullName() +
                "\nEmail: " + contact.getEmail() +
                "\nMessage:\n" + contact.getYourMessage();

        sendMail(recipient, subject, body, contact.getEmail());
    }

    public void sendMail(String to, String subject, String body, String replyTo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, fromName));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            if (replyTo != null && !replyTo.isBlank()) {
                helper.setReplyTo(replyTo);
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
