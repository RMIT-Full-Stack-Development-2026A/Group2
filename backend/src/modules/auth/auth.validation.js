// Sign-up and sign-in field checks (same rules as the frontend).
const ALLOWED_COUNTRIES = [
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

// Max email length.
const EMAIL_MAX_LENGTH = 255;
// Email cannot contain spaces or ( ) ; :
const EMAIL_FORBIDDEN_CHARS = /[\s();:]/;
// Likely typos: .coma vs .com, etc.
const TLD_TYPO_BASES = ["com", "net", "org", "edu", "gov"];

function isLikelyTldTypo(tld) {
  const t = tld.toLowerCase();
  return TLD_TYPO_BASES.some(
    (b) => t.length === b.length + 1 && t.startsWith(b),
  );
}

// Email issues to show (zero or more).
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

function validateUsername(username) {
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

function validateDisplayName(displayName, field = "displayName") {
  if (typeof displayName !== "string" || !displayName.trim()) {
    return [
      err(
        field,
        "Display name is required. It is shown publicly on your profile.",
      ),
    ];
  }
  return [];
}

function validateEmail(email, field = "email") {
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

function validatePassword(password) {
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
    errors.push(
      err(
        "password",
        "Password must be at least 8 characters long.",
      ),
    );
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
    errors.push(
      err(
        "password",
        "Password must include at least one number (0–9).",
      ),
    );
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

function validateCountry(country) {
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

function validateRegisterBody(body) {
  const errors = [];
  const {
    username,
    email,
    password,
    confirmPassword,
    country,
  } = body ?? {};

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

function validateLoginBody(body) {
  const errors = [];
  const { identifier, password } = body ?? {};

  if (typeof identifier !== "string" || !identifier.trim()) {
    errors.push(
      err(
        "identifier",
        "Enter your email or username to sign in.",
      ),
    );
  } else if (identifier.includes("@")) {
    errors.push(...validateEmail(identifier, "identifier"));
  }

  if (typeof password !== "string" || !password.length) {
    errors.push(
      err(
        "password",
        "Password is required to sign in.",
      ),
    );
  }

  return errors;
}

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  ALLOWED_COUNTRIES,
  validateUsername,
  validateDisplayName,
  validateEmail,
  validateCountry,
  validatePassword,
};
