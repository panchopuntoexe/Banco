import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  show(): void {
    this.loadingCount++;
    this.updateLoadingState();
  }

  hide(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    this.updateLoadingState();
  }

  reset(): void {
    this.loadingCount = 0;
    this.updateLoadingState();
  }

  isLoading(): boolean {
    return this.loadingCount > 0;
  }

  private updateLoadingState(): void {
    const isLoading = this.loadingCount > 0;
    this.loadingSubject.next(isLoading);
  }
}
