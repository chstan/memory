import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import QuickAddCard from "../components/QuickAddCard";
import { Heading, Link, StatGroup, StatLabel, StatNumber } from "@chakra-ui/core";
import KeyboardHint from "../components/KeyboardHint";
import { KeyboardBoundAction } from "../common/types";
import { useNavigationAction } from "../utils/hooks";
import RichMarkdownAddCardForm from "../forms/RichMarkdownAddCardForm";


const Dashboard = () => {
    const me = useMeQuery();
    useNavigationAction(KeyboardBoundAction.NavigateToStudy);

    return (
        <div>
            <p>Dashboard</p>
            <section>
                <RichMarkdownAddCardForm />
            </section>
            <section>
                <div>
                    <StatGroup>
                        <StatLabel>Due Now</StatLabel>
                        <StatNumber>{me.data?.me.cardsDueCount}</StatNumber>
                    </StatGroup>
                    <StatGroup>
                        <StatLabel>Katas</StatLabel>
                        <StatNumber>{me.data?.me.katasDueCount}</StatNumber>
                    </StatGroup>
                    <KeyboardHint placeholder="auto" action={KeyboardBoundAction.NavigateToStudy}>
                        <div>
                        <NextLink href="/study">
                            <Link>
                                <Heading>Study</Heading>
                            </Link>
                        </NextLink>
                        </div>
                    </KeyboardHint>
                </div>
            </section>
            <QuickAddCard />
        </div>
    );
}

export default Dashboard;