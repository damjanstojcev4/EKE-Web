package com.ece.ece_website.service;
import com.ece.ece_website.entity.TrainingSession;
import com.ece.ece_website.dto.TrainingSessionRequest;
import com.ece.ece_website.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
@Service @RequiredArgsConstructor
public class TrainingSessionService {
 private final TrainingSessionRepository repository;
 private final ContentValidation v;
 
 @Transactional public TrainingSession save(Long id, TrainingSessionRequest r) {
  var e=id==null ? new TrainingSession() : repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"));
  String slug=v.slug(r.slug());
  if(repository.existsBySlugAndIdNot(slug,id==null?-1L:id)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Slug already exists");
  if(r.title()==null || r.title().isBlank()) ContentValidation.fail("Title is required");
  if(r.startDate()!=null && r.endDate()!=null && r.endDate().isBefore(r.startDate())) ContentValidation.fail("End date precedes start date");
  if(r.opensAt()!=null && r.registrationDeadline()!=null && !r.opensAt().isBefore(r.registrationDeadline())) ContentValidation.fail("Opening time must precede deadline");
  if(r.availability()==null || !java.util.Set.of("OPEN","CLOSED","UPCOMING").contains(r.availability())) ContentValidation.fail("Invalid availability");
  
  e.setSlug(v.text(r.slug(),160));
  e.setTitle(v.text(r.title(),255));
  e.setDescription(v.text(r.description(),10000));
  e.setCategory(v.text(r.category(),255));
  e.setLocation(v.text(r.location(),255));
  e.setStartDate(r.startDate());
  e.setEndDate(r.endDate());
  e.setOpensAt(r.opensAt());
  e.setRegistrationDeadline(r.registrationDeadline());
  e.setRegistrationUrl(v.url(r.registrationUrl()));
  e.setPublished(r.published());
  e.setAvailability(v.text(r.availability(),255));
  e.setAudience(v.text(r.audience(),255));
  e.setFormat(v.text(r.format(),255));
  e.setLanguage(v.text(r.language(),255));
  e.setCost(v.text(r.cost(),255));
  e.setLearningObjectives(v.text(r.learningObjectives(),10000));
  e.setTrainingMethods(v.text(r.trainingMethods(),10000));
  return repository.saveAndFlush(e);
 }
}
