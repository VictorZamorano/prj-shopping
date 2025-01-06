// type StatusCode = string | number;

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
    case "400: Not exist":
      return {
        status: 400,
        message: "This product does not exist, enter a valid product"
      };
    case "400: This category does not exist":
      return {
        status: 400,
        message: "Bad Request, the data entered is not valid, please check and add all data"
      };
      case "404": 
       return {
        status: 404,
        message: "This product does not exist"
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
  