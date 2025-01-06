interface ErrorResult {
  status: number;
  message: string
};

const defaultErrors: {
  [key: string]: ErrorResult;
} = {
  "500": { status: 500, message: "Server Error" },
  "default": { status: 500, message: "Server error, error unknown" }
};

export const handleErrors = (code: string): ErrorResult => {
  const codeString = code.toString();
  const error = defaultErrors[codeString] || defaultErrors["default"]
  // No code errors
    if(!code) {
      return defaultErrors["default"]
  };

  // Specific errors
  switch (code){
    case "400":
      return {
        status: 400,
        message: "Bad Request, the data entered is not valid, please check and add all data"
      };
    case "400: Field not select": 
      return {
        status: 400,
        message: "You have not selected the field to modify"
      };
    case "400: Error pass length":
      return {
        status: 400,
        message: "The password does not respect the requested format"
        };
    case "400: New parameter is empty or invalid": 
      return {
        status: 400,
        message: "Please, enter a parameter valid in the field. Check that it is not empty"
      };
    case "401: Account or password empty":
      return {
        status: 401,
        message: "The account or password fields are empty, please enter your information"
      };
    case "401: Account or password incorrect":
      return {
        status: 401,
        message: "The account or password you provided is incorrect, please try again"
      };
      case "404": 
      return {
        status: 404,
        message: "This user does not exist"
      };
    default:
      return error;
  }

};


// export class DatabaseError extends Error {
//     constructor(message: string, public code: number) {
//       super(message);
//       this.name = 'DatabaseError';
//     }
//   };

// export class ValidationError extends Error {
//     constructor(message: string) {
//       super(message);
//       this.name = "ValidationError";
//     }
//   };
  