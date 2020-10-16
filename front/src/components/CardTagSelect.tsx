import { useApolloClient } from "@apollo/client";
import React, { useCallback, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { CB, SelectOption, ValueHandler } from "../common/types";
import { TagsDocument, TagSnippetFragment } from "../generated/graphql";

interface ICardTagSelectProps {
  onChange?: ValueHandler<Array<SelectOption<number | string>>>;
  
  name: string,
  value: Array<SelectOption<number | string>>,
  onBlur: React.EventHandler<any>,
}

const CardTagSelect = (props: ICardTagSelectProps) => {
  const client = useApolloClient();
  const onChange = useCallback((options: null | Array<SelectOption<number | string>>) => {
    if (props.onChange) {
      props.onChange(options || []);
    }
  }, []);

  const fetchTags = useCallback(
    async (search: string, cb?: CB) => {
      const tagsResult = await client.query({
        query: TagsDocument,
        variables: { tagName: search },
      });

      if (tagsResult.data?.tags.nodes) {
        return tagsResult.data.tags.nodes.map((tag: TagSnippetFragment) => {
          return {
            label: tag.name,
            value: tag.id,
          };
        });
      }

      return [];
    },
    [client]
  );

  return (
    <AsyncCreatableSelect
      loadOptions={fetchTags}
      cacheOptions
      onBlur={props.onBlur}
      isMulti
      value={props.value}
      isClearable
      name={props.name}
      onChange={onChange as any}
      placeholder="Tags"
      className="select"
    />
  );
};

export default CardTagSelect;
