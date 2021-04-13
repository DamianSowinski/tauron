import { DayUsage } from '../app/model/DayUsage';
import { ZoneUsage } from '../app/model/ZoneUsage';
import { MonthUsage } from '../app/model/MonthUsage';
import { YearUsage } from '../app/model/YearUsage';
import { RangeUsage } from '../app/model/RangeUsage';

export const environment = {
  production: false,
  test: true
};

export const MOCK_DATA = {
  dayUsage: `
{
    "date": "2021-04-05",
    "consume": {
        "day": 2.7,
        "night": 2.64,
        "total": 5.34
    },
    "generate": {
        "day": 10.42,
        "night": 3.16,
        "total": 13.57
    },
    "hours": [
        {
            "hour": 1,
            "consume": 0.234,
            "generate": 0
        },
        {
            "hour": 2,
            "consume": 0.248,
            "generate": 0
        },
        {
            "hour": 3,
            "consume": 0.232,
            "generate": 0
        },
        {
            "hour": 4,
            "consume": 0.238,
            "generate": 0
        },
        {
            "hour": 5,
            "consume": 0.218,
            "generate": 0
        },
        {
            "hour": 6,
            "consume": 0.228,
            "generate": 0
        },
        {
            "hour": 7,
            "consume": 0.212,
            "generate": 0.009
        },
        {
            "hour": 8,
            "consume": 0.427,
            "generate": 0.121
        },
        {
            "hour": 9,
            "consume": 0.268,
            "generate": 0.902
        },
        {
            "hour": 10,
            "consume": 0.001,
            "generate": 1.661
        },
        {
            "hour": 11,
            "consume": 0.067,
            "generate": 2.239
        },
        {
            "hour": 12,
            "consume": 0.001,
            "generate": 2.453
        },
        {
            "hour": 13,
            "consume": 0.046,
            "generate": 1.583
        },
        {
            "hour": 14,
            "consume": 0.489,
            "generate": 1.335
        },
        {
            "hour": 15,
            "consume": 0.151,
            "generate": 1.82
        },
        {
            "hour": 16,
            "consume": 0.049,
            "generate": 0.652
        },
        {
            "hour": 17,
            "consume": 0.04,
            "generate": 0.635
        },
        {
            "hour": 18,
            "consume": 0.18,
            "generate": 0.163
        },
        {
            "hour": 19,
            "consume": 0.244,
            "generate": 0
        },
        {
            "hour": 20,
            "consume": 0.167,
            "generate": 0
        },
        {
            "hour": 21,
            "consume": 0.386,
            "generate": 0
        },
        {
            "hour": 22,
            "consume": 0.612,
            "generate": 0
        },
        {
            "hour": 23,
            "consume": 0.387,
            "generate": 0
        },
        {
            "hour": 24,
            "consume": 0.218,
            "generate": 0
        }
    ]
}
`,
  monthUsage: `
  {
    "date": "2021-03",
    "consume": {
        "day": 158.83,
        "night": 78.22,
        "total": 237.04
    },
    "generate": {
        "day": 217.13,
        "night": 76.82,
        "total": 293.96
    },
    "days": [
        {
            "day": 1,
            "consume": 10.572,
            "generate": 0.928
        },
        {
            "day": 2,
            "consume": 8.768,
            "generate": 16.382
        },
        {
            "day": 3,
            "consume": 5.194,
            "generate": 17.024
        },
        {
            "day": 4,
            "consume": 6.558,
            "generate": 11.198
        },
        {
            "day": 5,
            "consume": 10.838,
            "generate": 2.369
        },
        {
            "day": 6,
            "consume": 7.971,
            "generate": 15.494
        },
        {
            "day": 7,
            "consume": 10.97,
            "generate": 2.683
        },
        {
            "day": 8,
            "consume": 7.889,
            "generate": 6.015
        },
        {
            "day": 9,
            "consume": 6.052,
            "generate": 12.314
        },
        {
            "day": 10,
            "consume": 6.513,
            "generate": 16.332
        },
        {
            "day": 11,
            "consume": 6.384,
            "generate": 4.697
        },
        {
            "day": 12,
            "consume": 6.323,
            "generate": 7.541
        },
        {
            "day": 13,
            "consume": 8.859,
            "generate": 10.719
        },
        {
            "day": 14,
            "consume": 9.216,
            "generate": 8.471
        },
        {
            "day": 15,
            "consume": 6.357,
            "generate": 5.908
        },
        {
            "day": 16,
            "consume": 6.294,
            "generate": 5.779
        },
        {
            "day": 17,
            "consume": 6.949,
            "generate": 2.954
        },
        {
            "day": 18,
            "consume": 5.491,
            "generate": 10.224
        },
        {
            "day": 19,
            "consume": 6.803,
            "generate": 9.217
        },
        {
            "day": 20,
            "consume": 10.714,
            "generate": 7.05
        },
        {
            "day": 21,
            "consume": 8.358,
            "generate": 5.747
        },
        {
            "day": 22,
            "consume": 6.13,
            "generate": 16.158
        },
        {
            "day": 23,
            "consume": 8.171,
            "generate": 10.437
        },
        {
            "day": 24,
            "consume": 6.318,
            "generate": 4.773
        },
        {
            "day": 25,
            "consume": 6.904,
            "generate": 12.885
        },
        {
            "day": 26,
            "consume": 5.314,
            "generate": 11.641
        },
        {
            "day": 27,
            "consume": 9.994,
            "generate": 11.306
        },
        {
            "day": 28,
            "consume": 10.534,
            "generate": 14.462
        },
        {
            "day": 29,
            "consume": 8.679,
            "generate": 4.7
        },
        {
            "day": 30,
            "consume": 4.684,
            "generate": 10.913
        },
        {
            "day": 31,
            "consume": 7.239,
            "generate": 17.634
        }
    ]
}
  `,
  yearUsage: `
  {
    "year": 2021,
    "consume": {
        "day": 590.01,
        "night": 274.02,
        "total": 864.04
    },
    "generate": {
        "day": 413.37,
        "night": 153.86,
        "total": 567.23
    },
    "months": [
        {
            "month": 1,
            "consume": 322.638,
            "generate": 58.621
        },
        {
            "month": 2,
            "consume": 271.272,
            "generate": 143.746
        },
        {
            "month": 3,
            "consume": 237.04,
            "generate": 293.955
        },
        {
            "month": 4,
            "consume": 33.086,
            "generate": 70.903
        },
        {
            "month": 5,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 6,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 7,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 8,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 9,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 10,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 11,
            "consume": 0,
            "generate": 0
        },
        {
            "month": 12,
            "consume": 0,
            "generate": 0
        }
    ]
}
  `,
  allUsage: `
  {
    "consume": {
        "day": 2862.05,
        "night": 1125.3,
        "total": 3987.35
    },
    "generate": {
        "day": 3023.53,
        "night": 990.1,
        "total": 4013.63
    },
    "years": [
        {
            "year": 2020,
            "consume": 3115.395,
            "generate": 3435.593
        },
        {
            "year": 2021,
            "consume": 871.952,
            "generate": 578.042
        }
    ]
}
  `,
  rangeUsage: `
{
    "startDate": "2021-01",
    "endDate": "2021-03",
    "consume": {
        "day": 566.65,
        "night": 264.31,
        "total": 830.96
    },
    "generate": {
        "day": 361.33,
        "night": 135,
        "total": 496.33
    },
    "months": [
        {
            "month": "2021-01",
            "consume": 322.638,
            "generate": 58.621
        },
        {
            "month": "2021-02",
            "consume": 271.272,
            "generate": 143.746
        },
        {
            "month": "2021-03",
            "consume": 237.04,
            "generate": 293.955
        }
    ]
}
  `,
  collectionUsage: `
  {
    "days": [
        {
            "date": "2021-03-29",
            "consume": {
                "day": 5.43,
                "night": 3.25,
                "total": 8.68
            },
            "generate": {
                "day": 3.48,
                "night": 1.22,
                "total": 4.7
            },
            "hours": [
                {
                    "hour": 1,
                    "consume": 0.232,
                    "generate": 0
                },
                {
                    "hour": 2,
                    "consume": 0.203,
                    "generate": 0
                },
                {
                    "hour": 3,
                    "consume": 0.222,
                    "generate": 0
                },
                {
                    "hour": 4,
                    "consume": 0.216,
                    "generate": 0
                },
                {
                    "hour": 5,
                    "consume": 0.213,
                    "generate": 0
                },
                {
                    "hour": 6,
                    "consume": 0.228,
                    "generate": 0
                },
                {
                    "hour": 7,
                    "consume": 0.369,
                    "generate": 0
                },
                {
                    "hour": 8,
                    "consume": 0.5,
                    "generate": 0.007
                },
                {
                    "hour": 9,
                    "consume": 0.125,
                    "generate": 0.061
                },
                {
                    "hour": 10,
                    "consume": 0.985,
                    "generate": 0.308
                },
                {
                    "hour": 11,
                    "consume": 0.183,
                    "generate": 0.599
                },
                {
                    "hour": 12,
                    "consume": 0.643,
                    "generate": 0.964
                },
                {
                    "hour": 13,
                    "consume": 0.104,
                    "generate": 0.722
                },
                {
                    "hour": 14,
                    "consume": 0.003,
                    "generate": 0.675
                },
                {
                    "hour": 15,
                    "consume": 1.197,
                    "generate": 0.542
                },
                {
                    "hour": 16,
                    "consume": 0.256,
                    "generate": 0.42
                },
                {
                    "hour": 17,
                    "consume": 0.14,
                    "generate": 0.301
                },
                {
                    "hour": 18,
                    "consume": 0.131,
                    "generate": 0.096
                },
                {
                    "hour": 19,
                    "consume": 0.339,
                    "generate": 0.005
                },
                {
                    "hour": 20,
                    "consume": 0.394,
                    "generate": 0
                },
                {
                    "hour": 21,
                    "consume": 0.746,
                    "generate": 0
                },
                {
                    "hour": 22,
                    "consume": 0.511,
                    "generate": 0
                },
                {
                    "hour": 23,
                    "consume": 0.443,
                    "generate": 0
                },
                {
                    "hour": 24,
                    "consume": 0.296,
                    "generate": 0
                }
            ]
        },
        {
            "date": "2021-03-28",
            "consume": {
                "day": 8.67,
                "night": 1.86,
                "total": 10.53
            },
            "generate": {
                "day": 9.79,
                "night": 4.67,
                "total": 14.46
            },
            "hours": [
                {
                    "hour": 1,
                    "consume": 0.083,
                    "generate": 0
                },
                {
                    "hour": 2,
                    "consume": 0.094,
                    "generate": 0
                },
                {
                    "hour": 3,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "hour": 4,
                    "consume": 0.076,
                    "generate": 0
                },
                {
                    "hour": 5,
                    "consume": 0.09,
                    "generate": 0
                },
                {
                    "hour": 6,
                    "consume": 0.087,
                    "generate": 0
                },
                {
                    "hour": 7,
                    "consume": 0.09,
                    "generate": 0.001
                },
                {
                    "hour": 8,
                    "consume": 1.673,
                    "generate": 0.032
                },
                {
                    "hour": 9,
                    "consume": 0.975,
                    "generate": 0.503
                },
                {
                    "hour": 10,
                    "consume": 0.311,
                    "generate": 1.422
                },
                {
                    "hour": 11,
                    "consume": 0.307,
                    "generate": 1.468
                },
                {
                    "hour": 12,
                    "consume": 0.511,
                    "generate": 0.905
                },
                {
                    "hour": 13,
                    "consume": 1.572,
                    "generate": 1.432
                },
                {
                    "hour": 14,
                    "consume": 0.379,
                    "generate": 2.867
                },
                {
                    "hour": 15,
                    "consume": 0.464,
                    "generate": 1.805
                },
                {
                    "hour": 16,
                    "consume": 0.299,
                    "generate": 2.206
                },
                {
                    "hour": 17,
                    "consume": 0.03,
                    "generate": 1.108
                },
                {
                    "hour": 18,
                    "consume": 0.014,
                    "generate": 0.647
                },
                {
                    "hour": 19,
                    "consume": 0.943,
                    "generate": 0.066
                },
                {
                    "hour": 20,
                    "consume": 0.769,
                    "generate": 0
                },
                {
                    "hour": 21,
                    "consume": 0.843,
                    "generate": 0
                },
                {
                    "hour": 22,
                    "consume": 0.337,
                    "generate": 0
                },
                {
                    "hour": 23,
                    "consume": 0.319,
                    "generate": 0
                },
                {
                    "hour": 24,
                    "consume": 0.268,
                    "generate": 0
                }
            ]
        }
    ],
    "months": [
        {
            "date": "2021-03",
            "consume": {
                "day": 158.83,
                "night": 78.22,
                "total": 237.04
            },
            "generate": {
                "day": 217.13,
                "night": 76.82,
                "total": 293.96
            },
            "days": [
                {
                    "day": 1,
                    "consume": 10.572,
                    "generate": 0.928
                },
                {
                    "day": 2,
                    "consume": 8.768,
                    "generate": 16.382
                },
                {
                    "day": 3,
                    "consume": 5.194,
                    "generate": 17.024
                },
                {
                    "day": 4,
                    "consume": 6.558,
                    "generate": 11.198
                },
                {
                    "day": 5,
                    "consume": 10.838,
                    "generate": 2.369
                },
                {
                    "day": 6,
                    "consume": 7.971,
                    "generate": 15.494
                },
                {
                    "day": 7,
                    "consume": 10.97,
                    "generate": 2.683
                },
                {
                    "day": 8,
                    "consume": 7.889,
                    "generate": 6.015
                },
                {
                    "day": 9,
                    "consume": 6.052,
                    "generate": 12.314
                },
                {
                    "day": 10,
                    "consume": 6.513,
                    "generate": 16.332
                },
                {
                    "day": 11,
                    "consume": 6.384,
                    "generate": 4.697
                },
                {
                    "day": 12,
                    "consume": 6.323,
                    "generate": 7.541
                },
                {
                    "day": 13,
                    "consume": 8.859,
                    "generate": 10.719
                },
                {
                    "day": 14,
                    "consume": 9.216,
                    "generate": 8.471
                },
                {
                    "day": 15,
                    "consume": 6.357,
                    "generate": 5.908
                },
                {
                    "day": 16,
                    "consume": 6.294,
                    "generate": 5.779
                },
                {
                    "day": 17,
                    "consume": 6.949,
                    "generate": 2.954
                },
                {
                    "day": 18,
                    "consume": 5.491,
                    "generate": 10.224
                },
                {
                    "day": 19,
                    "consume": 6.803,
                    "generate": 9.217
                },
                {
                    "day": 20,
                    "consume": 10.714,
                    "generate": 7.05
                },
                {
                    "day": 21,
                    "consume": 8.358,
                    "generate": 5.747
                },
                {
                    "day": 22,
                    "consume": 6.13,
                    "generate": 16.158
                },
                {
                    "day": 23,
                    "consume": 8.171,
                    "generate": 10.437
                },
                {
                    "day": 24,
                    "consume": 6.318,
                    "generate": 4.773
                },
                {
                    "day": 25,
                    "consume": 6.904,
                    "generate": 12.885
                },
                {
                    "day": 26,
                    "consume": 5.314,
                    "generate": 11.641
                },
                {
                    "day": 27,
                    "consume": 9.994,
                    "generate": 11.306
                },
                {
                    "day": 28,
                    "consume": 10.534,
                    "generate": 14.462
                },
                {
                    "day": 29,
                    "consume": 8.679,
                    "generate": 4.7
                },
                {
                    "day": 30,
                    "consume": 4.684,
                    "generate": 10.913
                },
                {
                    "day": 31,
                    "consume": 7.239,
                    "generate": 17.634
                }
            ]
        }
    ],
    "years": [
        {
            "year": 2021,
            "consume": {
                "day": 594.89,
                "night": 277.06,
                "total": 871.95
            },
            "generate": {
                "day": 420.62,
                "night": 157.42,
                "total": 578.04
            },
            "months": [
                {
                    "month": 1,
                    "consume": 322.638,
                    "generate": 58.621
                },
                {
                    "month": 2,
                    "consume": 271.272,
                    "generate": 143.746
                },
                {
                    "month": 3,
                    "consume": 237.04,
                    "generate": 293.955
                },
                {
                    "month": 4,
                    "consume": 41.002,
                    "generate": 81.72
                },
                {
                    "month": 5,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 6,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 7,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 8,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 9,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 10,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 11,
                    "consume": 0,
                    "generate": 0
                },
                {
                    "month": 12,
                    "consume": 0,
                    "generate": 0
                }
            ]
        }
    ]
}
  `
};

export const MOCK_DAYS_USAGE = [
  new DayUsage(
    new Date(2020, 0, 1, 12),
    new ZoneUsage(4, 3, 7),
    new ZoneUsage(20, 8, 28),
    [{hour: 1, consume: 2.15, generate: 3.64}]
  ),
  new DayUsage(
    new Date(2020, 0, 13, 12),
    new ZoneUsage(5, 4, 9),
    new ZoneUsage(18, 7, 25),
    [{hour: 1, consume: 5.15, generate: 1.64}]
  )
];

export const MOCK_MONTHS_USAGE = [
  new MonthUsage(
    new Date(2020, 0, 1, 12),
    new ZoneUsage(217.66, 104.98, 322.64),
    new ZoneUsage(42.31, 16.32, 58.62),
    [{day: 1, consume: 9.175, generate: 0.832}]
  ),

  new MonthUsage(
    new Date(2020, 1, 25, 12),
    new ZoneUsage(190.16, 190.16, 271.27),
    new ZoneUsage(101.89, 41.86, 143.75),
    [{day: 1, consume: 7.659, generate: 3.345}]
  )
];

export const MOCK_YEARS_USAGE = [
  new YearUsage(
    2020,
    new ZoneUsage(2267.16, 848.24, 3115.4),
    new ZoneUsage(2602.91, 832.68, 3435.59),
    [{month: 1, consume: 253.093, generate: 347.047}]
  ),
  new YearUsage(
    2021,
    new ZoneUsage(606.17, 284.33, 890.51),
    new ZoneUsage(452.78, 169.27, 622.06),
    [{month: 1, consume: 322.638, generate: 58.621}]
  )
];

export const MOCK_RANGES_USAGE = [
  new RangeUsage(
    new Date(2021, 0, 1, 12),
    new Date(2021, 1, 1, 12),
    new ZoneUsage(100, 100, 200),
    new ZoneUsage(200, 200, 400),
    [{month: '2021-01', consume: 100, generate: 200},
      {month: '2021-02', consume: 80, generate: 322}]
  ),
  new RangeUsage(
    new Date(2021, 1, 25, 12),
    new Date(2021, 3, 25, 12),
    new ZoneUsage(200, 150, 350),
    new ZoneUsage(500, 400, 700),
    [{month: '2021-02', consume: 377, generate: 100},
      {month: '2021-03', consume: 221, generate: 350},
      {month: '2021-04', consume: 150, generate: 432}]
  )
];
