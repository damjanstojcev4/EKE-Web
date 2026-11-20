package com.ece.ece_website.config;

import com.ece.ece_website.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final NewsService newsService;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploads = Path.of(System.getProperty("user.dir"), "uploads");
        Path newsUploads = uploads.resolve("news");
        String location = uploads.toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .setCacheControl(org.springframework.http.CacheControl.noStore())
                .addResourceLocations(location.endsWith("/") ? location : location + "/")
                .resourceChain(false)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resource = super.getResource(resourcePath, location);
                        if (resource == null) {
                            return null;
                        }
                        Path file = resource.getFile().toPath().toAbsolutePath().normalize();
                        boolean newsFile = file.startsWith(newsUploads)
                                || (Files.isDirectory(newsUploads) && file.toRealPath().startsWith(newsUploads.toRealPath()));
                        if (newsFile && !newsService.canReadImage(resource.getFilename(),
                                SecurityContextHolder.getContext().getAuthentication())) {
                            return null;
                        }
                        return resource;
                    }
                });
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin",
                        "Access-Control-Request-Method", "Access-Control-Request-Headers")
                .allowCredentials(true);

    }
}
