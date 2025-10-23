// src/api/APIUtil.js
import { get, post } from "aws-amplify/api";

/**
 * Members
 */
export async function getMembers(entityId) {
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
export async function createMember(entityId, payload) {
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
  return body.json(); // expected: { userId: "..." }
}

/**
 * Resources
 */
export async function getResources(entityId) {
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
export async function createResource(entityId, payload) {
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

/**
 * Calendar
 */
export async function getCalendar(entityId, monthStr, yearNumber) {
  const path = "/calendar/user/All/month/".concat(monthStr, "/year/").concat(yearNumber);
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