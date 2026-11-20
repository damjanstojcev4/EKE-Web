package com.ece.ece_website.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.server.ResponseStatusException;
@RestControllerAdvice
public class ApiErrors {
 @ExceptionHandler(ResponseStatusException.class) public ResponseEntity<?> invalid(ResponseStatusException e) { return ResponseEntity.status(e.getStatusCode()).body(java.util.Map.of("message", e.getReason()==null?"Invalid request":e.getReason())); }
 @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class) public ResponseEntity<?> conflict() { return ResponseEntity.status(409).body(java.util.Map.of("message","A unique value already exists or a related record is invalid")); }
 @ExceptionHandler(java.time.format.DateTimeParseException.class) public ResponseEntity<?> date() { return ResponseEntity.badRequest().body(java.util.Map.of("message","Invalid date")); }
}
