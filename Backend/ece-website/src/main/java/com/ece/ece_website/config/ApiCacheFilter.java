package com.ece.ece_website.config;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
/** Publication revocation must take effect on the next request, including media. */
@Component
public class ApiCacheFilter extends OncePerRequestFilter {
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
  response.setHeader("Cache-Control","no-store");chain.doFilter(request,response);
 }
}
