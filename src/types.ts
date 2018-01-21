export interface IReadonlyTime {
  readonly hours: number;
  readonly minutes: number;
  clone(): ITime;
  diff(otherTime: IReadonlyTime): number;
  equals(otherTime: IReadonlyTime): boolean;
  getMinutesToNextHour(): number;
  isValid(): boolean;
  toJSON(): string;
  toString(): string;
  valueOf(): number;
}

export interface ITime extends IReadonlyTime {
  addHours(hours: number): ITime;
  addMinutes(minutes: number): ITime;
  setHours(hours: number): ITime;
  setMinutes(minutes: number): ITime;
}
