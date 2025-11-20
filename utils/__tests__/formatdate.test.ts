import { formatDate } from "../formatDate";

describe("formatDate", () => {
  test("remove caracteres não numéricos", () => {
    expect(formatDate("12a3b4")).toBe("12/34");
  });

  test("formata corretamente para DD/MM", () => {
    expect(formatDate("1234")).toBe("12/34");
  });

  test("formata corretamente para DD/MM/AAAA", () => {
    expect(formatDate("12041999")).toBe("12/04/1999");
  });

  test("limita a 10 caracteres", () => {
    expect(formatDate("120419990000")).toBe("12/04/1999");
  });

  test("funciona digitando aos poucos", () => {
    expect(formatDate("1")).toBe("1");
    expect(formatDate("12")).toBe("12");
    expect(formatDate("123")).toBe("12/3");
    expect(formatDate("1234")).toBe("12/34");
    expect(formatDate("12345")).toBe("12/34/5");
  });
});
