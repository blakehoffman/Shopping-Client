import { AlertSettings } from "../constants/alert-settings";

export class Alert {
    message: string | undefined;
    autoClose: boolean | undefined;
    alertType: string | undefined;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}