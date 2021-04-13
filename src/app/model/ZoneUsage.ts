export class ZoneUsage {
  private readonly _day: number;
  private readonly _night: number;
  private readonly _total: number;

  constructor(day: number, night: number = 0, total: number = 0) {
    this._day = day;
    this._night = night;
    this._total = total;
  }

  get day(): number {
    return this._day;
  }

  get night(): number {
    return this._night;
  }

  get total(): number {
    return this._total;
  }

  static createFromJson(data: object): ZoneUsage {
    // @ts-ignore
    const {day, night, total} = data;

    return new ZoneUsage(day, night, total);
  }

  toObject(): object {
    const {_day: day, _night: night, _total: total} = this;
    return {day, night, total};
  }
}
