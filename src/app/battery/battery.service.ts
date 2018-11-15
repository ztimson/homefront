import {Injectable} from '@angular/core';
import {firebaseApp} from '../app.module';

@Injectable({
    providedIn: 'root'
})
export class BatteryService {
    readonly firestore;

    average = 0;
    temperatureData = [];
    percentageData = [];
    batteries = [];
    last: Date;

    constructor() {
        this.firestore = firebaseApp.firestore();
        this.firestore.settings({timestampsInSnapshots: true});
        this.firestore.collection('Battery').doc('TEMP').onSnapshot(snap => {
            this.last = new Date();

            let data = snap.data();
            this.batteries = Object.keys(data).map(key => ({name: key, history: data[key].reverse()}));
            this.average = this.batteries.reduce((acc, battery) => acc + battery.history[0].percentage, 0) / this.batteries.length;
            this.percentageData = this.batteries.map(battery => ({name: battery.name, value: battery.history[0].percentage * 100}));
            this.temperatureData = this.batteries.map(battery => ({name: battery.name, value: Math.round(battery.history[0].temp * 10) / 10}));
        });
    }

    get icon() {
        if (!this.batteries.length) return 'battery_alert';
        if (!this.last) return 'battery_warn';

        return 'battery_full';

        let temp = 'battery';
        //if (this.batteries.length) temp += '_charging';

        if (this.average <= 20) {
            temp += '_20';
        } else if (this.average <= 30) {
            temp += '_30';
        } else if (this.average <= 50) {
            temp += '_50';
        } else if (this.average <= 60) {
            temp += '_60';
        } else if (this.average <= 80) {
            temp += '_80';
        } else if (this.average <= 90) {
            temp += '_90';
        } else if (this.average > 90) {
            temp += 'full'
        }

        return temp;
    }
}
