import { ZoneUsage } from './ZoneUsage';
import { EnergyUsage } from './EnergyUsage';

interface ShortMonthUsage {
  month: number;
  consume: number;
  generate: number;
}

export class YearUsage extends EnergyUsage {
  private readonly _year: number;
  private readonly _months: ShortMonthUsage[];

  constructor(year: number, consume: ZoneUsage, generate: ZoneUsage, months: ShortMonthUsage[]) {
    super(consume, generate);
    this._year = year;
    this._months = months;
  }

  get months(): ShortMonthUsage[] {
    return this._months;
  }

  get year(): number {
    return this._year;
  }

  static createFromJson(data: object): YearUsage {
    // @ts-ignore
    const {year, consume, generate, months} = data;

    return new YearUsage(
      +year,
      ZoneUsage.createFromJson(consume),
      ZoneUsage.createFromJson(generate),
      months
    );
  }

  toObject(): object {
    return {
      year: this.year,
      consume: this.consume.toObject(),
      generate: this.generate.toObject(),
      months: this.months.map((item) => {
        const {month, consume, generate} = item;
        return {month, consume, generate};
      })
    };
  }
}
