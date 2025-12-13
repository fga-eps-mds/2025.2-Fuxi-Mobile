import { formatDate } from "../formatDate";

describe("formatDate utility", () => {
  // ------------------------------
  // ISO DATE TESTES
  // ------------------------------

  it("formata uma data ISO (YYYY-MM-DD) corretamente", () => {
    expect(formatDate("2025-12-10")).toBe("10/12/2025");
  });

  it("retorna vazio quando recebe string vazia", () => {
    expect(formatDate("")).toBe("");
  });

  // ------------------------------
  // MÁSCARA DE DATA (DIGITAÇÃO)
  // ------------------------------

  it("remove caracteres não numéricos", () => {
    expect(formatDate("12a3b4c")).toBe("12/34");
  });

  it("adiciona barra após dia com mais de 2 dígitos", () => {
    expect(formatDate("123")).toBe("12/3");
  });

  it("adiciona segunda barra após mês com mais de 4 dígitos", () => {
    expect(formatDate("12345")).toBe("12/34/5");
  });

  it("limita o máximo a 10 caracteres", () => {
    expect(formatDate("1234567890123")).toBe("12/34/5678");
  });

  // ------------------------------
  // CASOS DE BORDA
  // ------------------------------

  it("retorna string parcial corretamente (1 dígito)", () => {
    expect(formatDate("1")).toBe("1");
  });

  it("retorna string parcial corretamente (2 dígitos)", () => {
    expect(formatDate("12")).toBe("12");
  });

  it("formata corretamente data completa digitada sem barras", () => {
    expect(formatDate("10122025")).toBe("10/12/2025");
  });

  it("mantém zeros e números pequenos corretamente", () => {
    expect(formatDate("01022025")).toBe("01/02/2025");
  });
});
