// src/api/APIUtil.js
import { get, post, put, del } from "aws-amplify/api";

/**
 * ============================================
 * MEMBERS API CALLS
 * ============================================
 */

export async function getMembers(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "UsersAPI",
    path: "/users",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getMemberById(entityId, memberId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "UsersAPI",
    path: "/users/".concat(memberId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createMember(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "UsersAPI",
    path: "/users",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateMember(entityId, memberId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "UsersAPI",
    path: "/users/".concat(memberId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteMember(entityId, memberId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "UsersAPI",
    path: "/users/".concat(memberId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * RESOURCES API CALLS
 * ============================================
 */

export async function getResources(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "ResourcesAPI",
    path: "/resources",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getResourceById(entityId, resourceId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "ResourcesAPI",
    path: "/resources/".concat(resourceId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createResource(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "ResourcesAPI",
    path: "/resources",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateResource(entityId, resourceId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "ResourcesAPI",
    path: "/resources/".concat(resourceId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteResource(entityId, resourceId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "ResourcesAPI",
    path: "/resources/".concat(resourceId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * CALENDAR API CALLS
 * ============================================
 */

export async function getCalendar(entityId, userId, month, year) {
  console.log('InvAPIUtil entityId:' + entityId);
  const monthName = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  const path = "/calendar/user/".concat(userId, "/month/").concat(monthName, "/year/").concat(year);
  const op = get({
    apiName: "CalendarAPI",
    path,
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getCalendarByDate(entityId, userId, month, year) {
  return getCalendar(entityId, userId, month, year);
}
export async function getRecurringCalendar(entityId, userId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const path = "/".concat(userId, "/recurring/");
  const op = get({
    apiName: "CalendarAPI",
    path,
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getAllRecurringCalendar(entityId) {
  return getRecurringCalendar(entityId, "All");
}

/**
 * ============================================
 * EVENTS API CALLS
 * ============================================
 */

export async function getEvents(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "EventsAPI",
    path: "/event",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getEventById(entityId, eventId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "EventsAPI",
    path: "/event/".concat(eventId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createEvent(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "EventsAPI",
    path: "/event",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateEvent(entityId, eventId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "EventsAPI",
    path: "/event/".concat(eventId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteEvent(entityId, eventId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "EventsAPI",
    path: "/event/".concat(eventId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * SUBSCRIPTIONS API CALLS
 * ============================================
 */

export async function getSubscriptions(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "SubscriptionsAPI",
    path: "/subscription",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getSubscriptionById(entityId, subscriptionId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "SubscriptionsAPI",
    path: "/subscription/".concat(subscriptionId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createSubscription(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "SubscriptionsAPI",
    path: "/subscription",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateSubscription(entityId, subscriptionId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "SubscriptionsAPI",
    path: "/subscription/".concat(subscriptionId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteSubscription(entityId, subscriptionId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "SubscriptionsAPI",
    path: "/subscription/".concat(subscriptionId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * SUBSCRIPTION PLANS API CALLS
 * ============================================
 */

export async function getSubscriptionPlans(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "SubscriptionsAPI",
    path: "/subscription-plans",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getSubscriptionPlanById(entityId, planId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "SubscriptionsAPI",
    path: "/subscription-plans/".concat(planId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createSubscriptionPlan(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "SubscriptionsAPI",
    path: "/subscription-plans",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateSubscriptionPlan(entityId, planId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "SubscriptionsAPI",
    path: "/subscription-plans/".concat(planId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * ITEMS API CALLS
 * ============================================
 */

export async function getItems(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "ItemsAPI",
    path: "/items",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getItemById(entityId, itemId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "ItemsAPI",
    path: "/items/".concat(itemId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getFeaturedItems(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "ItemsAPI",
    path: "/items/featured",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createItem(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "ItemsAPI",
    path: "/items",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateItem(entityId, itemId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "ItemsAPI",
    path: "/items/".concat(itemId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteItem(entityId, itemId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "ItemsAPI",
    path: "/items/".concat(itemId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * CATEGORIES API CALLS
 * ============================================
 */

export async function getCategories(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "CategoriesAPI",
    path: "/categories",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getCategoryById(entityId, categoryId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "CategoriesAPI",
    path: "/categories/".concat(categoryId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createCategory(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "CategoriesAPI",
    path: "/categories",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateCategory(entityId, categoryId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "CategoriesAPI",
    path: "/categories/".concat(categoryId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteCategory(entityId, categoryId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "CategoriesAPI",
    path: "/categories/".concat(categoryId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * ORDERS API CALLS
 * ============================================
 */

export async function getOrders(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "OrdersAPI",
    path: "/orders",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getOrderById(entityId, orderId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "OrdersAPI",
    path: "/orders/".concat(orderId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function createOrder(entityId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = post({
    apiName: "OrdersAPI",
    path: "/orders",
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function updateOrder(entityId, orderId, payload) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = put({
    apiName: "OrdersAPI",
    path: "/orders/".concat(orderId),
    options: {
      headers: {
        entityid: entityId
      },
      body: payload
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function deleteOrder(entityId, orderId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = del({
    apiName: "OrdersAPI",
    path: "/orders/".concat(orderId),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}

/**
 * ============================================
 * DASHBOARD API CALLS
 * ============================================
 */

export async function getDashboardData(entityId) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "DashboardAPI",
    path: "/dashboard",
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}
export async function getDashboardMetrics(entityId, metric) {
  console.log('InvAPIUtil entityId:' + entityId);
  const op = get({
    apiName: "DashboardAPI",
    path: "/dashboard/".concat(metric),
    options: {
      headers: {
        entityid: entityId
      }
    },
    authMode: "userPool"
  });
  const {
    body
  } = await op.response;
  return body.json();
}