import { ZoneUsage } from './ZoneUsage';
import { HelperService } from '../service/helper.service';
import { EnergyUsage } from './EnergyUsage';

interface HourUsage {
  hour: number;
  consume: number;
  generate: number;
}

export class DayUsage extends EnergyUsage {
  private readonly _date: Date;
  private readonly _hours: HourUsage[];

  constructor(date: Date, consume: ZoneUsage, generate: ZoneUsage, hours: HourUsage[]) {
    super(consume, generate);
    this._date = date;
    this._hours = hours;
  }

  get hours(): HourUsage[] {
    return this._hours;
  }

  get date(): Date {
    return this._date;
  }

  static createFromJson(data: object): DayUsage {
    // @ts-ignore
    const {date, consume, generate, hours} = data;

    return new DayUsage(
      HelperService.getDateFromString(date),
      ZoneUsage.createFromJson(consume),
      ZoneUsage.createFromJson(generate),
      hours
    );
  }

  toObject(): object {
    return {
      date: this.date.toJSON().substr(0, 10),
      consume: this.consume.toObject(),
      generate: this.generate.toObject(),
      hours: this.hours.map((item) => {
        const {hour, consume, generate} = item;
        return {hour, consume, generate};
      })
    };
  }
}
