import { isValueEmpty } from "../client/js/isValueEmpty";

test("returns true if value is empty", () => {
  expect(isValueEmpty("")).toBe(true);
});

test("returns false if value is not empty", () => {
  expect(isValueEmpty("This is not an empty string.")).toBe(false);
});
