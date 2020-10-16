import { Stack, Tag } from "@chakra-ui/core";
import React from "react";
import { TagSnippetFragment } from "../generated/graphql";

interface ICardTagProps {
    tags?: Array<TagSnippetFragment>;
}

export const CardTags = (props: ICardTagProps) => {
    return (
        <Stack>
            {(props.tags || []).map((t, i) => <Tag key={i}>{t.name}</Tag>)}
        </Stack>
    );
}
export default CardTags;