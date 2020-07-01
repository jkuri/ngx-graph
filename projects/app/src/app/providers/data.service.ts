import { Injectable } from '@angular/core';
import { addDays, subSeconds } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  generateRandomDateValues(
    n: number = 10,
    min = 0,
    max = 100,
    fromDate = new Date().setHours(0, 0, 0, 0)
  ): { x: Date; y: number }[] {
    return Array.from(Array(n).keys()).map((x, i) => ({ x: addDays(fromDate, i), y: this.randomInt(min, max) }));
  }

  generateRandomRealtimeData(
    n: number = 10,
    step: number = 1,
    min: number = 0,
    max: number = 100,
    date = new Date()
  ): { date: Date; value: number }[] {
    return Array.from(Array(n).keys())
      .map((_, i) => ({
        date: subSeconds(date, i * step),
        value: this.randomInt(min, max)
      }))
      .reverse();
  }

  randomInt(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
