package org.ourses.server.aop;

import org.apache.commons.lang3.text.StrBuilder;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AspectLogger {

    @Before("pointCutLog()")
    public void beforeLog(JoinPoint joinPoint) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        int index = 0;
        StrBuilder message = new StrBuilder("call : " + joinPoint.getSignature().getName());
        while (index < joinPoint.getArgs().length) {
            message.append(", {}");
            index++;
        }
        logger.info(message.toString(), joinPoint.getArgs());
    }

    @AfterReturning(pointcut = "pointCutLog()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        String message = "return : " + joinPoint.getSignature().getName() + " {}";
        String object = null;
        if (result != null) {
            object = result.toString();
        }
        logger.info(message, object);
    }

    @Pointcut("execution(* org.ourses.server..*.*(..))")
    private void pointCutLog() {
    }
}
