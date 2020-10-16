import React, { useCallback } from "react";
import { Box, Button, FormControl } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import withApollo from "../utils/withApollo";
import { useForm } from "react-hook-form";

interface ILoginFormData {
  email: string;
  password: string;
}

const INITIAL_LOGIN_FORM_DATA: ILoginFormData = {
  email: "",
  password: "",
};

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: INITIAL_LOGIN_FORM_DATA,
  });

  const onSubmit = useCallback(
    async (values: ILoginFormData) => {
      console.log(values);
      const response = await login({
        variables: {
          input: values,
        },
      });
      if (response.data?.login.loggedInUser) {
        const token = response.data?.login.token;
        if (token) localStorage.setItem("token", token);

        if (typeof router.query.next === "string") {
          router.push(router.query.next);
        } else {
          router.push("/dashboard");
        }
      }
    },
    [login]
  );

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <InputField name="email" placeholder="email" label="Email" ref={register} />
          <Box mt={4}>
            <InputField name="password" placeholder="password" label="Password" type="password" ref={register} />
          </Box>
          <Button mt={4} type="submit" isLoading={formState.isSubmitting} variantColor="teal">
            Login
          </Button>
        </FormControl>
      </form>
    </Wrapper>
  );
};

export default withApollo(Login);
