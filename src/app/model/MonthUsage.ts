import { ZoneUsage } from './ZoneUsage';
import { HelperService } from '../service/helper.service';
import { EnergyUsage } from './EnergyUsage';


interface ShortDayUsage {
  day: number;
  consume: number;
  generate: number;
}

export class MonthUsage extends EnergyUsage {
  private readonly _date: Date;
  private readonly _days: ShortDayUsage[];

  constructor(date: Date, consume: ZoneUsage, generate: ZoneUsage, days: ShortDayUsage[]) {
    super(consume, generate);
    this._date = date;
    this._days = days;
  }

  get days(): ShortDayUsage[] {
    return this._days;
  }

  get date(): Date {
    return this._date;
  }

  static createFromJson(data: object): MonthUsage {
    // @ts-ignore
    const {date: dateStr, consume, generate, days} = data;

    return new MonthUsage(
      HelperService.getDateFromString(dateStr),
      ZoneUsage.createFromJson(consume),
      ZoneUsage.createFromJson(generate),
      days
    );
  }

  toObject(): object {
    return {
      date: this.date.toJSON().substr(0, 7),
      consume: this.consume.toObject(),
      generate: this.generate.toObject(),
      days: this.days.map((item) => {
        const {day, consume, generate} = item;
        return {day, consume, generate};
      })
    };
  }
}
