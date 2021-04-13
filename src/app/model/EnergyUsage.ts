import { ZoneUsage } from './ZoneUsage';

export abstract class EnergyUsage {
  private readonly _consume: ZoneUsage;
  private readonly _generate: ZoneUsage;

  protected constructor(consume: ZoneUsage, generate: ZoneUsage) {
    this._consume = consume;
    this._generate = generate;
  }

  get consume(): ZoneUsage {
    return this._consume;
  }

  get generate(): ZoneUsage {
    return this._generate;
  }
}
