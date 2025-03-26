import { setCookie, getCookie } from '../src/development-kit/cookies';

describe(`Cookie management works when`, () => {
  let documentCookie: string = ``;

  beforeEach(() => {
    documentCookie = ``;

    Object.defineProperty(document, `cookie`, {
      get: jest.fn(() => documentCookie),
      set: jest.fn((value) => {
        documentCookie = value;
      }),
      configurable: true,
    });
  });

  describe(`setting cookie with`, () => {
    it(`name and value for specified days`, () => {
      setCookie(`test`, `value`, 2);

      expect(documentCookie).toContain(`test=value`);
      expect(documentCookie).toContain(`expires=`);
    });

    it(`secure and strict same-site attributes`, () => {
      setCookie(`test`, `value`, 1);

      expect(documentCookie).toContain(`Secure`);
      expect(documentCookie).toContain(`SameSite=Strict`);
    });

    it(`path set to root`, () => {
      setCookie(`test`, `value`, 1);

      expect(documentCookie).toContain(`path=/`);
    });
  });

  describe(`getting cookie`, () => {
    it(`returns value when cookie exists`, () => {
      documentCookie = `existing=testvalue`;

      const value = getCookie(`existing`);

      expect(value).toBe(`testvalue`);
    });

    it(`returns null when cookie does not exist`, () => {
      documentCookie = `other=value`;

      const value = getCookie(`nonexistent`);

      expect(value).toBeNull();
    });

    it(`handles multiple cookies in document`, () => {
      documentCookie = `first=value1; second=value2; third=value3`;

      const secondValue = getCookie(`second`);

      expect(secondValue).toBe(`value2`);
    });
  });
});
