package com.ece.ece_website.controller;
import com.ece.ece_website.entity.TrainingSession;
import com.ece.ece_website.dto.TrainingSessionRequest;
import com.ece.ece_website.repository.TrainingSessionRepository;
import com.ece.ece_website.service.TrainingSessionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
@RestController @RequestMapping("/training") @RequiredArgsConstructor
public class TrainingSessionController {
 private final TrainingSessionRepository repository;
 private final TrainingSessionService service;
 @GetMapping("/sessions") public ResponseEntity<?> listing(@RequestParam(required=false) String status,@RequestParam(required=false) String category) {
  return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.findByPublishedTrueOrderByRegistrationDeadlineAscIdDesc().stream()
   .filter(e -> status==null || status.equals(e.getLifecycle())).filter(e -> category==null || category.equals(e.getCategory())).toList());
 }
 @GetMapping("/slug/{slug}") public ResponseEntity<TrainingSession> detail(@PathVariable String slug) { return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"))); }
 @GetMapping("/admin") public java.util.List<TrainingSession> admin() { return repository.findAll(org.springframework.data.domain.Sort.by("id").descending()); }
 @PostMapping("/admin") public TrainingSession create(@RequestBody TrainingSessionRequest r) { return service.save(null,r); }
 @PutMapping("/admin/{id}") public TrainingSession update(@PathVariable Long id,@RequestBody TrainingSessionRequest r) { return service.save(id,r); }
 @DeleteMapping("/admin/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"); repository.deleteById(id); }
}
