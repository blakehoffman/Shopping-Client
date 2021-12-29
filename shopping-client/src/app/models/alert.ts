import { AlertSettings } from "../constants/alert-settings";

export class Alert {
    id: string | undefined;
    message: string | undefined;
    autoClose: boolean | undefined;
    alertType: string | undefined;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}