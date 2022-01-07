import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AlertSettings } from 'src/app/constants/alert-settings';
import { Alert } from 'src/app/models/alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private defaultAlertType = AlertSettings.INFO;
    private subject = new BehaviorSubject<Alert | undefined>(undefined);

    alert(alert: Alert): void {
        alert.alertType = alert.alertType || this.defaultAlertType;
        this.subject.next(alert);
    }

    clear(alertType = this.defaultAlertType): void {
        this.subject.next(new Alert({ alertType: alertType }));
    }

    error(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.ERROR, message }))
    }

    info(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.INFO, message }))
    }

    onAlert(alertType = this.defaultAlertType): Observable<Alert | undefined> {
        return this.subject.asObservable().pipe(filter(x => x != undefined && x.alertType == alertType));
    }

    success(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.SUCCESS, message }))
    }
}
