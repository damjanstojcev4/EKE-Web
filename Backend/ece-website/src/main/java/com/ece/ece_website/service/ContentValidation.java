package com.ece.ece_website.service;
import com.fasterxml.jackson.databind.*;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.util.*;
@Component
public class ContentValidation {
 private final ObjectMapper json;
 public ContentValidation(ObjectMapper json) { this.json=json; }
 public String text(String value,int max) { if(value!=null && value.length()>max) fail("Text exceeds " + max + " characters"); return value; }
 public String slug(String value) { if(value==null || !value.matches("[a-z0-9]+(?:-[a-z0-9]+)*") || value.length()>160) fail("Use a slug of lowercase letters, digits and hyphens (maximum 160)"); return value; }
 public String url(String value) {
  if(value==null || value.isBlank()) return value;
  try { var u=java.net.URI.create(value); if(!Set.of("https","http").contains(u.getScheme()) || u.getHost()==null || u.getUserInfo()!=null) fail("Use an absolute HTTP(S) URL"); }
  catch(IllegalArgumentException e) { fail("Invalid URL"); } return text(value,2000);
 }
 public String blocks(String value) {
  if(value==null || value.isBlank()) return "[]";
  text(value,100000);
  try {
   JsonNode blocks=json.readTree(value);
   if(!blocks.isArray() || blocks.size()>100) fail("Content must be an array of at most 100 blocks");
   for(JsonNode b:blocks) {
    switch(b.path("type").asText()) {
     case "heading" -> requiredText(b.get("text"),500);
     case "paragraph" -> { JsonNode runs=b.path("text"); if(!runs.isArray() || runs.size()>100) fail("Paragraph text must contain at most 100 runs");
      for(JsonNode r:runs) { requiredText(r.get("text"),10000); if(r.has("href")) url(r.get("href").asText()); if(r.has("strong") && !r.get("strong").isBoolean()) fail("strong must be boolean"); }
     }
     case "list" -> { JsonNode items=b.path("items"); if(!items.isArray() || items.size()>100) fail("List requires at most 100 items"); for(JsonNode i:items) { requiredText(i.get("title"),500); requiredText(i.get("text"),10000); } }
     default -> fail("Unsupported content block");
    }
   } return json.writeValueAsString(blocks);
  } catch(com.fasterxml.jackson.core.JsonProcessingException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid content JSON"); }
 }
 private void requiredText(JsonNode n,int max) { if(n==null || !n.isTextual()) fail("Text must be a string"); text(n.asText(),max); }
 public String mediaReferences(String value,boolean partners) {
  if(value==null || value.isBlank()) return "[]";
  text(value,30000);
  try {
   JsonNode items=json.readTree(value); if(!items.isArray() || items.size()>50) fail("Media references require at most 50 items");
   for(JsonNode item:items) {
    requiredText(item.get(partners?"name":"title"),255); requiredText(item.get("url"),2000);
    String url=item.path("url").asText();
    if(!url.matches(partners?"/api/uploads/images/[a-zA-Z0-9_.%-]+":"/api/uploads/(pdf|images)/[a-zA-Z0-9_.%-]+")) fail("Use a managed project upload URL");
    if(partners) requiredText(item.get("alt"),255); else if(item.has("description")) requiredText(item.get("description"),4000);
   } return json.writeValueAsString(items);
  } catch(com.fasterxml.jackson.core.JsonProcessingException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid media JSON"); }
 }
 public String upload(MultipartFile file,Path directory,boolean pdf) throws java.io.IOException {
  String name=Objects.toString(file.getOriginalFilename(),"").toLowerCase(Locale.ROOT);
  String mime=Objects.toString(file.getContentType(),"");
  if(file.getSize()>(pdf?20:5)*1024*1024 || !(pdf ? name.endsWith(".pdf") && mime.equals("application/pdf") : name.matches(".*\\.(png|jpe?g|webp|gif)$") && Set.of("image/png","image/jpeg","image/webp","image/gif").contains(mime))) fail("Invalid upload type or size");
  if(name.length()>160) fail("Upload filename is too long");
  Files.createDirectories(directory); String filename=UUID.randomUUID()+"_"+name.replaceAll("[^a-z0-9._-]","_");
  file.transferTo(directory.resolve(filename)); return filename;
 }
 public static void fail(String reason) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,reason); }
}
