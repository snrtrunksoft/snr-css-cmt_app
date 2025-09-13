const awsExports = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_9VUmyAicP",
      userPoolClientId: "esfqap4e7joenc9ad7o7vs2j6",
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    },
    mandatorySignIn: true
  },
  API: {
    REST: {
      InventoryAPI: {
        endpoint: "https://m8wxr06qij.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1",
        authorizationType: "AMAZON_COGNITO_USER_POOLS"
      },
      ResourcesAPI: {
        endpoint: "https://bws4su8xog.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1",
        authorizationType: "AMAZON_COGNITO_USER_POOLS"
      },
      UsersAPI: {
        endpoint: "https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1",
        authorizationType: "AMAZON_COGNITO_USER_POOLS"
      },
      CalendarAPI: {
        endpoint: "https://pliol7eyw7.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1",
        authorizationType: "AMAZON_COGNITO_USER_POOLS"
      }
    }
  }
};
export default awsExports;