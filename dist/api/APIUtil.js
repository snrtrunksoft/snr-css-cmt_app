// src/api/APIUtil.js
import { get, post } from "aws-amplify/api";
import { MEMBERS_API, RESOURCES_API } from "../properties/EndPointProperties";

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

/**
 * Delete Member
 */
export async function deleteMember(entityId, memberId) {
  const response = await fetch("".concat(MEMBERS_API).concat(memberId), {
    method: "DELETE",
    headers: {
      entityid: entityId
    }
  });
  if (!response.ok) throw new Error("Failed to delete member: ".concat(response.statusText));
  return response.json();
}

/**
 * Delete Resource
 */
export async function deleteResource(entityId, resourceId) {
  const response = await fetch("".concat(RESOURCES_API).concat(resourceId), {
    method: "DELETE",
    headers: {
      entityid: entityId
    }
  });
  if (!response.ok) throw new Error("Failed to delete resource: ".concat(response.statusText));
  return response.json();
}