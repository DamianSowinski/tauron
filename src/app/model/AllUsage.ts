import { ZoneUsage } from './ZoneUsage';
import { EnergyUsage } from './EnergyUsage';

interface ShortYearUsage {
  year: number;
  consume: number;
  generate: number;
}

export class AllUsage extends EnergyUsage {
  private readonly _years: ShortYearUsage[];

  constructor(consume: ZoneUsage, generate: ZoneUsage, years: ShortYearUsage[]) {
    super(consume, generate);
    this._years = years;
  }

  get years(): ShortYearUsage[] {
    return this._years;
  }

  static createFromJson(data: object): AllUsage {
    // @ts-ignore
    const {consume, generate, years} = data;

    return new AllUsage(
      ZoneUsage.createFromJson(consume),
      ZoneUsage.createFromJson(generate),
      years
    );
  }
}
