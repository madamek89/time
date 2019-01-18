import { Time } from "../src/time";

describe("Time", () => {
  describe("constructor()", () => {
    interface ITestData {
      in: number[];
      out: number[];
    }

    const testData: ITestData[] = [
      { in: [8, 25], out: [8, 25] },
      { in: [21, 12], out: [21, 12] },
      { in: [28, 30], out: [4, 30] },
      { in: [16, 95], out: [17, 35] },
      { in: [9, 60], out: [10, 0] },
      { in: [0, 0], out: [0, 0] },
      { in: [24, 20], out: [24, 20] },
      { in: [-2, 40], out: [22, 40] },
      { in: [2, -40], out: [1, 20] },
      { in: [-2, -40], out: [22, 20] },
      { in: [2.2, 4.8], out: [2, 4] },
      { in: [NaN, NaN], out: [NaN, NaN] },
    ];

    for (const data of testData) {
      const [inHour, inMinute] = data.in;
      const [outHour, outMinute] = data.out;

      it(`should instantiate ${outHour}h ${outMinute}m from ${inHour}h ${inMinute}m`, () => {
        const time = new Time(inHour, inMinute);

        expect(time.hours).toBe(outHour);
        expect(time.minutes).toBe(outMinute);
      });
    }
  });

  describe("static fromString()", () => {
    interface ITestData {
      in: string;
      out: number[];
    }

    const testData: ITestData[] = [
      { in: "8:25", out: [8, 25] },
      { in: "08:25", out: [8, 25] },
      { in: "21:02", out: [21, 2] },
      { in: "21:2", out: [21, 2] },
      { in: "8:2", out: [8, 2] },
      { in: "-2:-20", out: [22, 40] },
      { in: "", out: [0, 0] },
      { in: ":", out: [0, 0] },
      { in: "test123:20", out: [NaN, 20] },
      { in: "8:xD", out: [8, NaN] },
      { in: "test123", out: [NaN, 0] },
      { in: "ab:gh", out: [NaN, NaN] },
    ];

    for (const data of testData) {
      const [outHour, outMinute] = data.out;

      it(`should instantiate ${outHour}h ${outMinute}m from '${data.in}'`, () => {
        const time = Time.fromString(data.in);

        expect(time.hours).toBe(outHour);
        expect(time.minutes).toBe(outMinute);
      });
    }

    it(`should return 0h 0m when param is null`, () => {
      const time = Time.fromString(null);

      expect(time.hours).toBe(0);
      expect(time.minutes).toBe(0);
    });

    it(`should return undefined when param is undefined`, () => {
      const time = Time.fromString(undefined);

      expect(time).toBeUndefined();
    });
  });

  describe("addHours()", () => {
    it("should add hours", () => {
      const time = new Time(8, 20);

      time.addHours(2);

      expect(time.hours).toBe(10);
      expect(time.minutes).toBe(20);
    });

    it("should subtract hours", () => {
      const time = new Time(8, 20);

      time.addHours(-2);

      expect(time.hours).toBe(6);
      expect(time.minutes).toBe(20);
    });

    it("should overflow to the next hour", () => {
      const time = new Time(8, 20);

      time.addMinutes(80);

      expect(time.hours).toBe(9);
      expect(time.minutes).toBe(40);
    });

    it('should overflow to next "day"', () => {
      const time = new Time(22, 10);

      time.addHours(3);

      expect(time.hours).toBe(1);
      expect(time.minutes).toBe(10);
    });

    it('should overflow to previous "day"', () => {
      const time = new Time(2, 10);

      time.addHours(-3);

      expect(time.hours).toBe(23);
      expect(time.minutes).toBe(10);
    });

    it("should ignore decimals", () => {
      const time = new Time(2, 10);

      time.addHours(4.5);

      expect(time.hours).toBe(6);
      expect(time.minutes).toBe(10);
    });
  });

  describe("addMinutes()", () => {
    interface ITestData {
      in: Time;
      minutesAdded: number;
      out: Time;
    }

    it("should add minutes", () => {
      const time = new Time(8, 20);

      time.addMinutes(15);

      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(35);
    });

    it("should subtract minutes", () => {
      const time = new Time(8, 20);

      time.addMinutes(-15);

      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(5);
    });


    describe("hour overflowing", () => {
      const testData : ITestData[]  = [
        {in:  new Time(8, 20), minutesAdded: -80, out: new Time(7, 0)},
        {in:  new Time(0, 0), minutesAdded: -0, out: new Time(0, 0)},
        {in:  new Time(23, 20), minutesAdded: -30, out: new Time(22, 50)},

        {in:  new Time(8, 20), minutesAdded: 80, out: new Time(9, 40)},
        {in:  new Time(0, 0), minutesAdded: 130, out: new Time(2, 10)},
        {in:  new Time(0, 0), minutesAdded: 61.9, out: new Time(1, 1)},
      ];

      for (const data of testData) {
        it("should overflow to next or previous hour", () => {
          const time = data.in;

          time.addMinutes(data.minutesAdded);

          expect(time.hours).toBe(data.out.hours);
          expect(time.minutes).toBe(data.out.minutes);
        });
      }
    });

    describe("day overflowing", () => {
      const testData : ITestData[]  = [
        {in:  new Time(22, 20), minutesAdded: 4 * 60 + 20, out: new Time(2, 40)},
        {in:  new Time(23, 30), minutesAdded: 40, out: new Time(24, 10)},
        {in:  new Time(-1.5, 0.5), minutesAdded: 65, out: new Time(24, 5)},
        {in:  new Time(0, 40), minutesAdded: 20, out: new Time(1, 0)},

        {in:  new Time(2, 20), minutesAdded: -4 * 60 - 20, out: new Time(22, 0)},
        {in:  new Time(24, 10), minutesAdded: -40, out: new Time(23, 30)},
        {in:  new Time(-2, -40), minutesAdded: -40, out: new Time(20, 40)},
        {in:  new Time(0, -40), minutesAdded: -20, out: new Time(23, 0)},
      ];

      for (const data of testData) {
        it("should overflow to next or previous day", () => {
          const time = data.in;

          time.addMinutes(data.minutesAdded);

          expect(time.hours).toBe(data.out.hours);
          expect(time.minutes).toBe(data.out.minutes);
        });
      }
    });


    it("should ignore decimals", () => {
      const time = new Time(2, 10);

      time.addMinutes(4.5);

      expect(time.hours).toBe(2);
      expect(time.minutes).toBe(14);
    });
  });

  describe("clone()", () => {
    it("should clone Time instance", () => {
      const time1 = new Time(8, 20);
      const time2 = time1.clone();

      expect(time2.hours).toBe(time1.hours);
      expect(time2.minutes).toBe(time1.minutes);
    });

    it("should create an independent copy of Time instance", () => {
      const time1 = new Time(8, 20);
      const time2 = time1.clone();

      time1.addMinutes(106);

      expect(time2.hours).not.toBe(time1.hours);
      expect(time2.minutes).not.toBe(time1.minutes);
    });
  });

  describe("diff()", () => {
    it("should calculate the difference between larger and smaller Time in minutes", () => {
      const time1 = new Time(8, 20);
      const time2 = new Time(9, 40);

      const diff = time2.diff(time1);

      expect(diff).toBe(80);
    });

    it("should calculate the difference between smaller and larger Time in minutes", () => {
      const time1 = new Time(8, 20);
      const time2 = new Time(9, 40);

      const diff = time1.diff(time2);

      expect(diff).toBe(-80);
    });
  });

  describe("equals()", () => {
    it("should return true when two Times have the same value", () => {
      const time1 = new Time(8, 20);
      const time2 = new Time(8, 20);

      expect(time1.equals(time2)).toBe(true);
    });

    it("should return true when comparing original to clone", () => {
      const time = new Time(8, 20);

      expect(time.equals(time.clone())).toBe(true);
    });

    it("should return false when two Times have different value", () => {
      const time1 = new Time(8, 20);
      const time2 = new Time(9, 20);

      expect(time1.equals(time2)).toBe(false);
    });
  });

  describe("getMinutesToNextHour()", () => {
    it("should get minutes to next hour", () => {
      const time1 = new Time(8, 20);

      expect(time1.getMinutesToNextHour()).toBe(40);
    });
  });

  describe("isValid()", () => {
    it("should return true when hours and minutes are valid numbers", () => {
      const time1 = new Time(8, 0);

      expect(time1.isValid()).toBe(true);
    });

    it("should return false when hours are NaN", () => {
      const time1 = new Time(NaN, 20);

      expect(time1.isValid()).toBe(false);
    });

    it("should return false when minutes are NaN", () => {
      const time1 = new Time(8, NaN);

      expect(time1.isValid()).toBe(false);
    });
  });

  describe("setHours()", () => {
    it("should set hours", () => {
      const time = new Time(8, 20);

      time.setHours(2);

      expect(time.hours).toBe(2);
      expect(time.minutes).toBe(20);
    });

    it('should overflow to next "day"', () => {
      const time = new Time(8, 20);

      time.setHours(28);

      expect(time.hours).toBe(4);
      expect(time.minutes).toBe(20);
    });

    it('should overflow to previous "day"', () => {
      const time = new Time(8, 20);

      time.setHours(-4);

      expect(time.hours).toBe(20);
      expect(time.minutes).toBe(20);
    });

    it("should ignore decimals", () => {
      const time = new Time(8, 20);

      time.setHours(2.5);

      expect(time.hours).toBe(2);
      expect(time.minutes).toBe(20);
    });
  });

  describe("setMinutes()", () => {
    it("should set minutes", () => {
      const time = new Time(8, 20);

      time.setMinutes(5);

      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(5);
    });

    it("should overflow to next hour", () => {
      const time = new Time(8, 20);

      time.setMinutes(60 + 12);

      expect(time.hours).toBe(9);
      expect(time.minutes).toBe(12);
    });

    it("should overflow to previous hour", () => {
      const time = new Time(8, 20);

      time.setMinutes(-24);

      expect(time.hours).toBe(7);
      expect(time.minutes).toBe(36);
    });

    it('should overflow to next "day"', () => {
      const time = new Time(8, 20);

      time.setMinutes(20 * 60);

      expect(time.hours).toBe(4);
      expect(time.minutes).toBe(0);
    });

    it('should overflow to previous "day"', () => {
      const time = new Time(8, 20);

      time.setMinutes(-20 * 60);

      expect(time.hours).toBe(12);
      expect(time.minutes).toBe(0);
    });

    it("should ignore decimals", () => {
      const time = new Time(8, 20);

      time.setMinutes(23.5);

      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(23);
    });
  });

  describe("toJSON()", () => {
    it("should be called by JSON.stringify()");
    it("should call toString()");
  });

  describe("toString()", () => {
    it("should format time with padding zeroes", () => {
      const time = new Time(8, 2);

      expect(time.toString()).toBe("08:02");
    });

    it("should format time as 24-hour", () => {
      const time = new Time(16, 30);

      expect(time.toString()).toBe("16:30");
    });
  });

  describe("valueOf()", () => {
    it("should return total minutes of Time", () => {
      const time = new Time(8, 30);

      expect(time.valueOf()).toBe(8 * 60 + 30);
    });
  });

  describe("fromDate()", () => {
    it("should return hours and minutes of Date", () => {
      const date = new Date(2018, 1, 1, 12, 33, 12, 120);
      const time = new Time(12, 33);

      expect(Time.fromDate(date)).toEqual(time);
    });

    it("should return undefined when param is undefined", () => {
      expect(Time.fromDate(undefined)).toBe(undefined);
    });
  });
});
