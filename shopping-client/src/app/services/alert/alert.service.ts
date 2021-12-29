import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AlertSettings } from 'src/app/constants/alert-settings';
import { Alert } from 'src/app/models/alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private defaultAlertId = AlertSettings.INFO;
    private subject = new BehaviorSubject<Alert | undefined>(undefined);

    alert(alert: Alert): void {
        alert.id = alert.id || this.defaultAlertId;
        this.subject.next(alert);
    }

    clear(id = this.defaultAlertId): void {
        this.subject.next(new Alert({ id }));
    }

    error(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.ERROR, message }))
    }

    info(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.INFO, message }))
    }

    onAlert(id = this.defaultAlertId): Observable<Alert | undefined> {
        return this.subject.asObservable().pipe(filter(x => x != undefined && x.id == id));
    }

    success(message: string, options?: any): void {
        this.alert(new Alert({ ...options, alertType: AlertSettings.SUCCESS, message }))
    }
}
