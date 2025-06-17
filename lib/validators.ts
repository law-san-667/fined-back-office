import z from "zod";

export const packTagsSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(1),
});

export const orgSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(1),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  logo: z
    .string({
      required_error: "Le logo est requis",
      invalid_type_error: "Le logo doit être une chaîne de caractères",
    })
    .url("Le logo doit être une URL valide")
    .optional(),
  website: z
    .string({
      required_error: "Le site web est requis",
      invalid_type_error: "Le site web doit être une chaîne de caractères",
    })
    .url("Le site web doit être une URL valide")
    .optional(),
  socialLinks: z
    .object({
      facebook: z
        .string({
          invalid_type_error:
            "Le lien Facebook doit être une chaîne de caractères",
        })
        .url("Le lien Facebook doit être une URL valide")
        .optional(),
      twitter: z
        .string({
          invalid_type_error:
            "Le lien Twitter doit être une chaîne de caractères",
        })
        .url("Le lien Twitter doit être une URL valide")
        .optional(),
      linkedin: z
        .string({
          invalid_type_error:
            "Le lien LinkedIn doit être une chaîne de caractères",
        })
        .url("Le lien LinkedIn doit être une URL valide")
        .optional(),
      instagram: z
        .string({
          invalid_type_error:
            "Le lien Instagram doit être une chaîne de caractères",
        })
        .url("Le lien Instagram doit être une URL valide")
        .optional(),
      youtube: z
        .string({
          invalid_type_error:
            "Le lien YouTube doit être une chaîne de caractères",
        })
        .url("Le lien YouTube doit être une URL valide")
        .optional(),
    })
    .optional(),
});
