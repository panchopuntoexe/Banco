import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';
import { AlertData } from '../../utils/models/alert.interface';
import { eAlertType } from '../../utils/enums/alert.enum';
import { of } from 'rxjs';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockAlertData: AlertData = {
    message: 'Test message',
    type: eAlertType.SUCCESS
  };

  const mockConfirmAlertData: AlertData = {
    message: 'Confirm message',
    type: eAlertType.SUCCESS,
    showConfirmButton: true,
    onConfirm: jasmine.createSpy('onConfirm')
  };

  beforeEach(async () => {
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['closeAlert'], {
      alertData$: of(null)
    });

    await TestBed.configureTestingModule({
      declarations: [ AlertComponent ],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    })
    .compileComponents();

    mockAlertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to alert service and set alertData', () => {
      const testAlertData: AlertData = {
        message: 'Test message',
        type: eAlertType.SUCCESS
      };
      
      // Recreate the spy with a new observable
      Object.defineProperty(mockAlertService, 'alertData$', {
        value: of(testAlertData),
        writable: false
      });

      component.ngOnInit();

      expect(component.alertData).toEqual(testAlertData);
    });
  });

  describe('onClose', () => {
    it('should call onConfirm and close alert when showConfirmButton is true', () => {
      component.alertData = mockConfirmAlertData;

      component.onConfirm();

      expect(mockConfirmAlertData.onConfirm).toHaveBeenCalled();
      expect(mockAlertService.closeAlert).toHaveBeenCalled();
    });

    it('should only close alert when showConfirmButton is false', () => {
      component.alertData = mockAlertData;

      component.onConfirm();

      expect(mockAlertService.closeAlert).toHaveBeenCalled();
    });

    it('should only close alert when onConfirm is not provided', () => {
      component.alertData = {
        message: 'Test',
        type: eAlertType.SUCCESS,
        showConfirmButton: true
      };

      component.onConfirm();

      expect(mockAlertService.closeAlert).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from alert service', () => {
      const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscription'] = mockSubscription;

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.alertData).toBeNull();
      expect(component['subscription']).toBeDefined();
    });
  });
}); 