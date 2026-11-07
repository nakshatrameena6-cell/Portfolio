/**
 * Identity and contact configuration.
 *
 * Only values verified on the public GitHub profile are filled in.
 * `email` and `linkedin` are intentionally null: nothing is published until
 * the owner supplies it. Set a value here and the Contact section shows it.
 */
export const site = {
  name: "Nakshatra S.V",
  firstName: "Nakshatra",
  handle: "nakshatrameena6-cell",
  role: "Computer Science and Engineering undergraduate",
  degree: "BE, Computer Science and Engineering",
  institution: "Sri Shakthi Institute of Engineering and Technology",
  github: "https://github.com/nakshatrameena6-cell",
  email: "nakshatrameena6@gmail.com" as string | null,
  linkedin: "https://www.linkedin.com/in/nakshatra-s-v-427656364/" as string | null,
  /** Sanskrit gloss shown in the opening composition. */
  gloss: {
    term: "nakṣatra",
    meaning: "a star; one of the 27 lunar mansions",
  },
} as const;

export const repoUrl = (repo: string) => `${site.github}/${repo}`;
