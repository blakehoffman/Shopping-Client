import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertSettings } from 'src/app/constants/alert-settings';
import { Alert } from 'src/app/models/alert';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

    private alertSubscription: Subscription | undefined;

    alerts: Alert[] = [];
    @Input() alertType: string = AlertSettings.INFO;
    @Input() fade = true;

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {
        this.alertSubscription = this.alertService.onAlert(this.alertType)
            .subscribe(alert => {
                console.log(alert);
                if (!alert) {
                    return;
                }

                if (!alert.message) {
                    this.alerts = [];
                    return;
                }

                this.alerts.push(alert);

                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
            });
    }

    ngOnDestory() {
        this.alertSubscription?.unsubscribe();
    }

    cssClass(alert: Alert): string {
        if (!alert) {
            return '';
        }

        const classes = ['alert-dismissible'];

        const classTypes: { [alertType: string]: string } = {
            [AlertSettings.SUCCESS]: 'alert alert-success',
            [AlertSettings.ERROR]: 'alert alert-danger',
            [AlertSettings.INFO]: 'alert alert-info',
        };

        classes.push(classTypes[alert.alertType ?? AlertSettings.INFO]);
        return classes.join(' ');
    }

    removeAlert(alert: Alert): void {
        if (!this.alerts.includes(alert)) {
            return;
        }

        this.alerts = this.alerts.filter(a => a != alert);
    }
}
