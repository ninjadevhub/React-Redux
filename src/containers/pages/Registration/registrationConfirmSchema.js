function lowerHere(str) {
  return str.match(/[a-z]/);
}
function upperHere(str) {
  return str.match(/[A-Z]/);
}

function numberHere(str) {
  return str.match(/[0-9]/);
}
var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
function specialHere(str) {
  return str.match(specialChars);
}
export default {
  username: [
    {
      rule: "required",
      error: "Username is required"
    }
  ],
  password: [
    {
      rule: "required",
      error: "Password is required"
    },

    {
      isValid: input => {
        const text = input || "";
        if (input) {
          return lowerHere(text)
            ? true
            : "Password must contain a lower case letter";
        } else {
          return true;
        }
      }
    },
    {
      isValid: input => {
        const text = input || "";
        if (input) {
          return upperHere(text)
            ? true
            : "Password must contain an upper case letter";
        } else {
          return true;
        }
      }
    },
    {
      isValid: input => {
        const text = input || "";
        if (input) {
          return numberHere(text) ? true : "Password must contain a number";
        } else {
          return true;
        }
      }
    },
    {
      isValid: input => {
        const text = input || "";
        if (input) {
          return specialHere(text)
            ? true
            : "Password must contain a special character";
        } else {
          return true;
        }
      }
    },
    {
      rule: "minLength",
      option: 8,
      error: "Password must contain at least 8 characters"
    }
  ],
  confirmPassword: [
    {
      rule: "isEqual",
      option: {
        match: "password"
      },
      error: "Password confirmation should match the password"
    }
  ]
};
