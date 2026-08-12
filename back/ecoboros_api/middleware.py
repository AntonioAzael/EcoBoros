import logging
import time

logger = logging.getLogger('django.request')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        # We don't log health checks or swagger to keep the console clean
        if '/swagger/' not in request.path and '/admin/' not in request.path:
            logger.info(
                f"{request.method} {request.get_full_path()} - "
                f"{response.status_code} - {duration:.2f}s"
            )
            
        return response
