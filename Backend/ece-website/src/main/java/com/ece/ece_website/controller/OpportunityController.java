package com.ece.ece_website.controller;
import com.ece.ece_website.entity.Opportunity;
import com.ece.ece_website.dto.OpportunityRequest;
import com.ece.ece_website.repository.OpportunityRepository;
import com.ece.ece_website.service.OpportunityService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
@RestController @RequestMapping("/opportunities") @RequiredArgsConstructor
public class OpportunityController {
 private final OpportunityRepository repository;
 private final OpportunityService service;
 @GetMapping("/public") public ResponseEntity<?> listing(@RequestParam(required=false) String status,@RequestParam(required=false) String category) {
  return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.findByPublishedTrueOrderByApplicationDeadlineAscIdDesc().stream()
   .filter(e -> status==null || status.equals(e.getLifecycle())).filter(e -> category==null || category.equals(e.getCategory())).toList());
 }
 @GetMapping("/slug/{slug}") public ResponseEntity<Opportunity> detail(@PathVariable String slug) { return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(repository.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"))); }
 @GetMapping("/admin") public java.util.List<Opportunity> admin() { return repository.findAll(org.springframework.data.domain.Sort.by("id").descending()); }
 @PostMapping("/admin") public Opportunity create(@RequestBody OpportunityRequest r) { return service.save(null,r); }
 @PutMapping("/admin/{id}") public Opportunity update(@PathVariable Long id,@RequestBody OpportunityRequest r) { return service.save(id,r); }
 @DeleteMapping("/admin/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"); repository.deleteById(id); }
}
