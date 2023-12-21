const toKebabCase = (str: string = ""): string =>
  (typeof str === "string" ? str : String(str))
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("-")
    .split("_")
    .join("-");

export default toKebabCase;
