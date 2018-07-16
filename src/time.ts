import { DAY, HOUR } from "./constants";
import { IReadonlyTime, ITime } from "./types";
import { mod, pad } from "./utils";

export class Time implements ITime {
  public static fromDate(date: Date): Time;
  public static fromDate(date: Date | undefined): Time | undefined;
  public static fromDate(date: Date | undefined): Time | undefined {
    if (date === undefined) {
      return undefined;
    }

    return new Time(date.getHours(), date.getMinutes());
  }

  public static fromString(time: string): Time;
  public static fromString(time: string | undefined): Time | undefined;
  public static fromString(time: string | undefined): Time | undefined {
    if (time === undefined) {
      return undefined;
    }

    time = time || "";

    const [hours, minutes] = time.split(":").map((s) => +s);

    return new Time(hours, minutes);
  }

  private _hours: number;
  private _minutes: number;

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }

  constructor(hours: number = 0, minutes: number = 0) {
    this._hours = hours;
    this._minutes = minutes;
    this.normalize();
  }

  public addHours(hours: number): Time {
    this._hours += hours;
    this.normalize();
    return this;
  }

  public addMinutes(minutes: number): Time {
    this._minutes += minutes;
    this.normalize();
    return this;
  }

  public clone(): Time {
    return new Time(this._hours, this._minutes);
  }

  public diff(otherTime: IReadonlyTime): number {
    return this.valueOf() - otherTime.valueOf();
  }

  public equals(otherTime: IReadonlyTime): boolean {
    return this.valueOf() === otherTime.valueOf();
  }

  public getMinutesToNextHour(): number {
    return HOUR - this._minutes;
  }

  public isValid(): boolean {
    return !isNaN(this._hours) && !isNaN(this._minutes);
  }

  public setHours(hours: number): Time {
    this._hours = hours;
    this.normalize();
    return this;
  }

  public setMinutes(minutes: number): Time {
    this._minutes = minutes;
    this.normalize();
    return this;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    const padded = [pad(this._hours), pad(this._minutes)];
    return padded.join(":");
  }

  public valueOf(): number {
    return (this._hours * HOUR) + this._minutes;
  }

  private normalize(): void {
    if (!this.isValid()) {
      return;
    }

    // truncate decimal part
    this._minutes |= 0;

    if (this._minutes >= HOUR || this._minutes < 0) {
      this._hours += this._minutes / HOUR;
      this._minutes = mod(this._minutes, HOUR);
    }

    this._hours |= 0;

    // DAY + 1 - allow both 24:00 and 00:00
    if (this._hours >= DAY + 1 || this._hours < 0) {
      this._hours = mod(this._hours, DAY);
    }
  }
}
