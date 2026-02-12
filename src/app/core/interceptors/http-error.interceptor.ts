import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

const RETRY_COUNT = 2;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

export function httpErrorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);
  const loggerService = inject(LoggerService);

  return next(request).pipe(
    timeout(REQUEST_TIMEOUT),
    retry({
      count: shouldRetry(request) ? RETRY_COUNT : 0,
      delay: RETRY_DELAY
    }),
    catchError((error: HttpErrorResponse) => {
      const errorMessage = handleHttpError(error);
      
      loggerService.error('HTTP Error', {
        url: request.url,
        method: request.method,
        status: error.status,
        message: errorMessage,
        error: error
      }, 'HttpErrorInterceptor');

      notificationService.showError(errorMessage);

      return throwError(() => error);
    })
  );
}

function shouldRetry(request: HttpRequest<unknown>): boolean {
  return request.method === 'GET';
}

function handleHttpError(error: HttpErrorResponse): string {
  if (error.error instanceof ErrorEvent) {
    return ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
  }

  return getServerErrorMessage(error);
}

function getServerErrorMessage(error: HttpErrorResponse): string {
  const backendMessage = error.error?.message;
  const backendErrors = error.error?.errors;

  if (backendErrors && Array.isArray(backendErrors) && backendErrors.length > 0) {
    const validationErrors = backendErrors
      .map((err: any) => {
        if (err.constraints) {
          return Object.values(err.constraints).join(', ');
        }
        return null;
      })
      .filter((msg: any) => msg !== null)
      .join('. ');

    if (validationErrors) {
      return validationErrors;
    }
  }

  if (backendMessage && typeof backendMessage === 'string') {
    return backendMessage;
  }

  const errorMap: Record<number, string> = {
    400: ERROR_MESSAGES.HTTP.BAD_REQUEST,
    401: ERROR_MESSAGES.HTTP.UNAUTHORIZED,
    403: ERROR_MESSAGES.HTTP.FORBIDDEN,
    404: ERROR_MESSAGES.HTTP.NOT_FOUND,
    409: ERROR_MESSAGES.HTTP.CONFLICT,
    422: ERROR_MESSAGES.HTTP.UNPROCESSABLE_ENTITY,
    500: ERROR_MESSAGES.HTTP.INTERNAL_SERVER_ERROR,
    502: ERROR_MESSAGES.HTTP.BAD_GATEWAY,
    503: ERROR_MESSAGES.HTTP.SERVICE_UNAVAILABLE,
    504: ERROR_MESSAGES.HTTP.GATEWAY_TIMEOUT
  };

  return errorMap[error.status] || `${ERROR_MESSAGES.HTTP.UNKNOWN_ERROR} (${error.status})`;
}
