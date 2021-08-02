package com.nixsolutions.server.configs.filters;

import static com.nixsolutions.server.configs.Constants.HEADER_STRING_AUTHORIZATION;
import static com.nixsolutions.server.configs.Constants.TOKEN_PREFIX;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nixsolutions.server.configs.jwttoken.TokenProvider;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;

public class JwtAuthenticationFilter extends OncePerRequestFilter
{

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HEADER_STRING_AUTHORIZATION);
        String username = null;
        String authToken = null;
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX,"");
            try {
                username = jwtTokenUtil.getUsernameFromToken(authToken);
//                throw new ExpiredJwtException(new Header()
//                {
//                    @Override
//                    public String getType()
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Header setType(String s)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public String getContentType()
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Header setContentType(String s)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public String getCompressionAlgorithm()
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Header setCompressionAlgorithm(String s)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public int size()
//                    {
//                        return 0;
//                    }
//
//                    @Override
//                    public boolean isEmpty()
//                    {
//                        return false;
//                    }
//
//                    @Override
//                    public boolean containsKey(Object key)
//                    {
//                        return false;
//                    }
//
//                    @Override
//                    public boolean containsValue(Object value)
//                    {
//                        return false;
//                    }
//
//                    @Override
//                    public Object get(Object key)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Object put(Object key, Object value)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Object remove(Object key)
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public void putAll(Map m)
//                    {
//
//                    }
//
//                    @Override
//                    public void clear()
//                    {
//
//                    }
//
//                    @Override
//                    public Set keySet()
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Collection values()
//                    {
//                        return null;
//                    }
//
//                    @Override
//                    public Set<Entry> entrySet()
//                    {
//                        return null;
//                    }
//                }, jwtTokenUtil.getAllClaimsFromToken(authToken), "");
            } catch (IllegalArgumentException e) {
                logger.error("an error occured during getting username from token", e);
            } catch (ExpiredJwtException e) {
//                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                logger.warn("the token is expired and not valid anymore", e);
            } catch(SignatureException e){
                logger.error("Authentication Failed. Username or Password not valid.");
            }
        } else {
            logger.warn("couldn't find bearer string, will ignore the header");
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = jwtTokenUtil
                    .getAuthentication(authToken, SecurityContextHolder.getContext().getAuthentication(), userDetails);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                logger.info("authenticated user " + username + ", setting security context");
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(req, res);
    }
}