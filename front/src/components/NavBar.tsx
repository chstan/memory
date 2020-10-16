import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation, MeQuery } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { KeyboardBoundAction, NAVIGATION_URLS } from "../common/types";
import { useNavigationAction } from "../utils/hooks";
import KeyboardHint from "./KeyboardHint";

type NavActionLinkProps = {
  action: KeyboardBoundAction;
};
const NavActionLink: React.FC<NavActionLinkProps> = ({ action, children }) => {
  if (!NAVIGATION_URLS.hasOwnProperty(action)) {
    throw new Error(`Unknown navigation action ${action}`);
  }
  const href = (NAVIGATION_URLS as any)[action] as string;

  useNavigationAction(action);
  return (
    <KeyboardHint action={action} zIndex={10}>
      <span>
        <NextLink href={href}>{children}</NextLink>
      </span>
    </KeyboardHint>
  );
};

const LoggedInNavbar = ({ me }: { me: MeQuery["me"] }) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return (
    <Flex align="center">
      <NavActionLink action={KeyboardBoundAction.NavigateToDashboard}>
        <Button as={Link}>Dashboard</Button>
      </NavActionLink>
      <NavActionLink action={KeyboardBoundAction.NavigateToStudy}>
        <Button as={Link}>Study</Button>
      </NavActionLink>
      <NavActionLink action={KeyboardBoundAction.NavigateToProfile}>
        <Button as={Link}>{me.email}</Button>
      </NavActionLink>
      <Button
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
        }}
        isLoading={logoutFetching}
        variant="link"
      >
        logout
      </Button>
    </Flex>
  );
};

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = <LoggedInNavbar me={data.me} />;
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="white" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>Memory</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
