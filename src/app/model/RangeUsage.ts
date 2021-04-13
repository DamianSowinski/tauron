import { ZoneUsage } from './ZoneUsage';
import { HelperService } from '../service/helper.service';
import { EnergyUsage } from './EnergyUsage';

interface ShortMonthUsage {
  month: string;
  consume: number;
  generate: number;
}

export class RangeUsage extends EnergyUsage {
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _months: ShortMonthUsage[];

  constructor(startDate: Date, endDate: Date, consume: ZoneUsage, generate: ZoneUsage, months: ShortMonthUsage[]) {
    super(consume, generate);
    this._startDate = startDate;
    this._endDate = endDate;
    this._months = months;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get months(): ShortMonthUsage[] {
    return this._months;
  }

  static createFromJson(data: object): RangeUsage {
    // @ts-ignore
    const {startDate: startDateStr, endDate: endDateStr, consume, generate, months} = data;

    return new RangeUsage(
      HelperService.getDateFromString(startDateStr),
      HelperService.getDateFromString(endDateStr),
      ZoneUsage.createFromJson(consume),
      ZoneUsage.createFromJson(generate),
      months
    );
  }

  toObject(): object {
    return {
      startDate: this.startDate.toJSON().substr(0, 7),
      endDate: this.endDate.toJSON().substr(0, 7),
      consume: this.consume.toObject(),
      generate: this.generate.toObject(),
      months: this.months.map((item) => {
        const {month, consume, generate} = item;
        return {month, consume, generate};
      })
    };
  }
}
