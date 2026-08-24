import { type Client, createClient } from "@osdk/client";
import { type PublicOauthClient, createPublicOauthClient } from "@osdk/oauth";

function getMetaTagContent(tagName: string): string {
  const elements = document.querySelectorAll(`meta[name="${tagName}"]`);
  const element = elements.item(elements.length - 1);
  const value = element ? element.getAttribute("content") : null;
  if (value == null || value === "") {
    throw new Error(`Meta tag ${tagName} not found or empty`);
  }
  if (value.match(/%.+%/)) {
    throw new Error(
      `Meta tag ${tagName} contains placeholder value. Please add ${value.replace(
        /%/g,
        "",
      )} to your .env files`,
    );
  }
  return value;
}

export const foundryUrl = getMetaTagContent("osdk-foundryUrl");
const clientId = getMetaTagContent("osdk-clientId");
const redirectUrl = getMetaTagContent("osdk-redirectUrl");
const ontologyRid = getMetaTagContent("osdk-ontologyRid");

const scopes = [
  "api:use-ontologies-read",
  "api:use-ontologies-write",
  "api:use-mediasets-read",
  "api:use-mediasets-write",
  "api:admin-read",
];

export const auth: PublicOauthClient = createPublicOauthClient(clientId, foundryUrl, redirectUrl, {
  scopes,
});

/** Shared OSDK client for ontology and platform API calls. */
export const client: Client = createClient(foundryUrl, ontologyRid, auth);

export default client;
