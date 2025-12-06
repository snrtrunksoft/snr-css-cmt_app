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
        UsersAPI: {
          endpoint: "https://kh9zku31eb.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        ResourcesAPI: {
          endpoint: "https://bws4su8xog.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        CalendarAPI: {
          endpoint: "https://pliol7eyw7.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        DashboardAPI: {
          endpoint: "https://n82x1bmdef.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        CategoriesAPI: {
          endpoint: "https://cx8712tt7e.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        ItemsAPI: {
          endpoint: "https://1p6bhnsms5.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        OrdersAPI: {
          endpoint: "https://m8wxr06qij.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        EventsAPI: {
          endpoint: "https://3jb2f8gsn0.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        },
        SubscriptionsAPI: {
          endpoint: "https://pky0yuomvc.execute-api.us-east-1.amazonaws.com/dev",
          region: "us-east-1",
          authorizationType: "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  };
  
  export default awsExports;