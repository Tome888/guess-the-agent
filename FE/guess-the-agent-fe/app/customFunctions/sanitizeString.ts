import z from "zod";


export function sanitizeString(input: unknown): string {
  const schema = z
    .string()
    .trim()
    .min(1, "String cannot be empty")
    .max(500, "String too long")
    .transform((val) => {
      let clean = val.replace(/<[^>]*>/gi, "");

      clean = clean
        .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/data:text\/html/gi, "");

      clean = clean.replace(/\s+/g, " ").trim();

      return clean;
    })
    .refine((val) => /^[\w\s.,!?'"():;@#&%+\-=/\\]*$/i.test(val), {
      message: "Contains invalid characters",
    });

  const result = schema.safeParse(input);
  return result.success ? result.data : "";
}
