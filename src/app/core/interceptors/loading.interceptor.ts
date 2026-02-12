import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export function loadingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(request).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
}
