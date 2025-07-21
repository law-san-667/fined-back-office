import z from "zod";

export const packTagsSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(1),
});

export const postTagsSchema = packTagsSchema;

export const initPackSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
      invalid_type_error: "Le titre doit être une chaîne de caractères",
    })
    .min(1),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  long_description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  image: z
    .string({
      required_error: "L'image est requise",
      invalid_type_error: "L'image doit être une chaîne de caractères",
    })
    .url("L'image doit être une URL valide")
    .optional(),
  tags: z.array(z.string()),
});

export const packDetailsSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
      invalid_type_error: "Le titre doit être une chaîne de caractères",
    })
    .min(1),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  long_description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  image: z
    .string({
      required_error: "L'image est requise",
      invalid_type_error: "L'image doit être une chaîne de caractères",
    })
    .url("L'image doit être une URL valide")
    .optional(),
  is_free: z.boolean(),
  price: z.number(),
  tags: z.array(z.string()),
});

export const orgSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
      invalid_type_error: "Le nom doit être une chaîne de caractères",
    })
    .min(1),
  domain: z
    .string({
      required_error: "Le domaine est requis",
      invalid_type_error: "Le domaine doit être une chaîne de caractères",
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
  social_links: z
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

export const documentSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
      invalid_type_error: "Le titre doit être une chaîne de caractères",
    })
    .min(1),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  url: z
    .string({
      required_error: "L'URL est requis",
      invalid_type_error: "L'URL doit être une chaîne de caractères",
    })
    .url("L'URL doit être une URL valide"),
  pageCount: z.coerce.number({
    message: "Le nombre de pages doit être un nombre",
    required_error: "Le nombre de pages est requis",
    invalid_type_error: "Le nombre de pages doit être un nombre",
  }),
  thumbnail: z
    .string({
      required_error: "L'image est requis",
      invalid_type_error: "L'image doit être une chaîne de caractères",
    })
    .url("L'image doit être une URL valide")
    .optional(),
});

export const videoSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
      invalid_type_error: "Le titre doit être une chaîne de caractères",
    })
    .min(1),
  description: z
    .string({
      required_error: "La description est requise",
      invalid_type_error: "La description doit être une chaîne de caractères",
    })
    .optional(),
  url: z
    .string({
      required_error: "L'URL est requis",
      invalid_type_error: "L'URL doit être une chaîne de caractères",
    })
    .url("L'URL doit être une URL valide"),
  duration: z.coerce.number({
    message: "Le nombre de pages doit être un nombre",
    required_error: "Le nombre de pages est requis",
    invalid_type_error: "Le nombre de pages doit être un nombre",
  }),
  thumbnail: z
    .string({
      required_error: "L'image est requis",
      invalid_type_error: "L'image doit être une chaîne de caractères",
    })
    .url("L'image doit être une URL valide")
    .optional(),
});

export const forumChannelSchema = z.object({
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
  color: z
    .string({
      invalid_type_error: "La couleur doit être une chaîne de caractères",
    })
    .optional(),
});
