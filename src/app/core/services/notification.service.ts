import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  dismissible?: boolean;
}

export interface ConfirmationDialog {
  id: string;
  message: string;
  type: NotificationType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private confirmationSubject = new Subject<ConfirmationDialog | null>();

  readonly notification$: Observable<Notification> = this.notificationSubject.asObservable();
  readonly confirmation$: Observable<ConfirmationDialog | null> = this.confirmationSubject.asObservable();

  private notificationIdCounter = 0;

  showSuccess(message: string, duration: number = 3000): void {
    this.show({
      id: this.generateId(),
      message,
      type: NotificationType.SUCCESS,
      duration,
      dismissible: true
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.show({
      id: this.generateId(),
      message,
      type: NotificationType.ERROR,
      duration,
      dismissible: true
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.show({
      id: this.generateId(),
      message,
      type: NotificationType.WARNING,
      duration,
      dismissible: true
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show({
      id: this.generateId(),
      message,
      type: NotificationType.INFO,
      duration,
      dismissible: true
    });
  }

  showConfirmation(
    message: string,
    type: NotificationType = NotificationType.WARNING,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): void {
    this.confirmationSubject.next({
      id: this.generateId(),
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    });
  }

  closeConfirmation(): void {
    this.confirmationSubject.next(null);
  }

  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  private generateId(): string {
    return `notification-${++this.notificationIdCounter}-${Date.now()}`;
  }
}
