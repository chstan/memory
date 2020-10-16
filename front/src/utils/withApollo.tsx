import React from "react";
import withApollo from "next-with-apollo";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, NormalizedCacheObject, ApolloLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import INITIAL_STATE from "../state/initialState";

let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createClient(initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }).restore(initialState);

  const client = new ApolloClient({
    cache,
    connectToDevTools: process.env.NODE_ENV === "development",
    credentials: "include",
    link: authLink.concat(httpLink),
  });

  return client;
}

function initApolloClient(initialState: NormalizedCacheObject) {
  if (!globalApolloClient) {
    globalApolloClient = createClient(initialState)
  }
  return globalApolloClient;
}

export default withApollo(
  ({ initialState }) => initApolloClient(initialState),
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
)
