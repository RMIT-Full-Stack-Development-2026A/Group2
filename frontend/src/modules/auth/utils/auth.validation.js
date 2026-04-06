// Sign-up checks. Country list must match backend auth.validation.js.
export const ALLOWED_COUNTRIES = [
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// Email rules match backend auth.validation.js.
const EMAIL_MAX_LENGTH = 255;
const EMAIL_FORBIDDEN_CHARS = /[\s();:]/;
const TLD_TYPO_BASES = ["com", "net", "org", "edu", "gov"];

function isLikelyTldTypo(tld) {
  const t = tld.toLowerCase();
  return TLD_TYPO_BASES.some(
    (b) => t.length === b.length + 1 && t.startsWith(b),
  );
}

function getStrictEmailViolations(trimmed) {
  const out = [];
  if (trimmed.length >= EMAIL_MAX_LENGTH) {
    out.push(
      "Email must be shorter than 255 characters. Example: you@example.com",
    );
  }
  if (EMAIL_FORBIDDEN_CHARS.test(trimmed)) {
    out.push(
      "Email must not contain spaces or the characters ( ) ; : . Example: name@example.com",
    );
  }

  const atParts = trimmed.split("@");
  if (atParts.length !== 2 || !atParts[0] || !atParts[1]) {
    out.push(
      "Email must contain exactly one @ symbol, with text before and after it. Example: you@example.com",
    );
    return out;
  }

  const domain = atParts[1];
  if (!domain.includes(".")) {
    out.push(
      "Email must contain at least one . (dot) after the @ symbol. Example: you@example.com",
    );
    return out;
  }

  const lastDot = domain.lastIndexOf(".");
  const tld = domain.slice(lastDot + 1);
  if (!tld || tld.length < 2) {
    out.push(
      "The part after the last dot (such as com or edu) must be at least 2 characters. Example: you@site.com",
    );
  } else if (isLikelyTldTypo(tld)) {
    out.push(
      "The domain looks misspelled (for example .coma instead of .com). Check the part after @. Example: you@gmail.com",
    );
  }

  return out;
}

const EXAMPLES = {
  username: "Example: player_one or Player-99",
  email: "Example: you@example.com",
  password:
    "Example: MyP@ssw0rd (8+ chars, 1 uppercase, 1 number, 1 special character)",
  country: "Choose a country from the dropdown.",
  confirmPassword: "Example: type the same password twice",
  identifier: "Example: player_one or you@example.com",
};

function err(field, message) {
  return {
    field,
    message,
    example: EXAMPLES[field] ?? EXAMPLES.password,
  };
}

export function validateUsername(username) {
  const errors = [];
  if (typeof username !== "string" || !username.trim()) {
    errors.push(
      err(
        "username",
        "Username is required. Use only letters, numbers, underscore (_), and hyphen (-).",
      ),
    );
    return errors;
  }
  const u = username.trim();
  if (!USERNAME_REGEX.test(u)) {
    errors.push(
      err(
        "username",
        'Username may only contain letters, numbers, "_" and "-".',
      ),
    );
  }
  return errors;
}

export function validateEmail(email, field = "email") {
  const errors = [];
  if (typeof email !== "string" || !email.trim()) {
    errors.push(
      err(
        field,
        "Email is required. It must include @ and a domain with a dot (e.g. .com).",
      ),
    );
    return errors;
  }
  const trimmed = email.trim();
  for (const message of getStrictEmailViolations(trimmed)) {
    errors.push(err(field, message));
  }
  return errors;
}

export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string" || password.length === 0) {
    errors.push(
      err(
        "password",
        "Password is required. It must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.",
      ),
    );
    return errors;
  }
  if (password.length < 8) {
    errors.push(err("password", "Password must be at least 8 characters long."));
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(
      err(
        "password",
        "Password must include at least one uppercase letter (A–Z).",
      ),
    );
  }
  if (!/[0-9]/.test(password)) {
    errors.push(err("password", "Password must include at least one number (0–9)."));
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(
      err(
        "password",
        "Password must include at least one special character (e.g. ! @ # $ %).",
      ),
    );
  }
  return errors;
}

export function validateCountry(country) {
  if (typeof country !== "string" || !ALLOWED_COUNTRIES.includes(country)) {
    return [
      err(
        "country",
        "Please select a valid country from the list.",
      ),
    ];
  }
  return [];
}

export function validateRegisterForm(form) {
  const errors = [];
  const { username, email, password, confirmPassword, country } = form ?? {};

  errors.push(...validateUsername(username));
  errors.push(...validateEmail(email));
  errors.push(...validatePassword(password));

  if (typeof confirmPassword !== "string" || confirmPassword !== password) {
    errors.push(
      err(
        "confirmPassword",
        "Confirm password must match your password exactly.",
      ),
    );
  }

  errors.push(...validateCountry(country));
  return errors;
}

// Password hint under the field.
export const PASSWORD_HINT =
  "MyP@ssw0rd — 8+ characters, at least one uppercase letter, one number, and one symbol (!@#$…).";

// Field errors as one string (fallback when not using the list UI).
export function formatValidationErrors(errors) {
  if (!errors?.length) return "";
  const items = errors.map((e) => e.message.trim());
  return ["Please fix the following:", "", ...items.map((m) => `• ${m}`)].join(
    "\n",
  );
}

export function getPasswordRulesStatus(password) {
  const p = typeof password === "string" ? password : "";
  return [
    { label: "At least 8 characters", ok: p.length >= 8 },
    { label: "At least 1 number", ok: /[0-9]/.test(p) },
    { label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(p) },
    { label: "At least 1 uppercase letter", ok: /[A-Z]/.test(p) },
  ];
}

// Human-readable text from an API error response.
export function parseApiErrorPayload(data, response) {
  const statusSuffix = response
    ? ` (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""})`
    : "";

  if (data?._nonJson) {
    const preview = data._textPreview?.trim() || "(empty body)";
    return `The server did not return JSON${statusSuffix}. Response preview: ${preview}`;
  }

  if (!data || typeof data !== "object") {
    return `Request failed${statusSuffix}.`;
  }

  if (data.errors?.length) {
    return formatValidationErrors(data.errors);
  }

  const m = data.message || data.error;
  if (m) {
    return m;
  }

  return `Request failed${statusSuffix}. Is the backend running on port 3000?`;
}
