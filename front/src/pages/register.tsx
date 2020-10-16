import React, { useCallback } from "react";
import { Box, Button, FormControl } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useAddUserMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import withApollo from "../utils/withApollo";
import { useForm } from "react-hook-form";

interface IRegisterProps {}
interface IRegisterFormData {
  email: string;
  name: string;
  password: string;
}

const INITIAL_REGISTER_FORM_DATA: IRegisterFormData = {
  email: "",
  name: "",
  password: "",
};

const Register: React.FC<IRegisterProps> = ({}) => {
  const router = useRouter();
  const [addUser] = useAddUserMutation();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: INITIAL_REGISTER_FORM_DATA,
  });

  const onSubmit = useCallback(
    async (values: IRegisterFormData) => {
      const response = await addUser({
        variables: { input: values },
      });
      if (response.data?.addUser) {
        router.push("/");
      }
    },
    [addUser]
  );

  return (
    <Wrapper variant="small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
            <InputField name="name" placeholder="Name" label="Name" ref={register}/>
            <Box mt={4}>
              <InputField name="email" placeholder="email" label="Email" ref={register} />
            </Box>
            <Box mt={4}>
              <InputField name="password" placeholder="password" label="Password" type="password" ref={register} />
            </Box>
            <Button mt={4} type="submit" isLoading={formState.isSubmitting} variantColor="teal">
              register
            </Button>
        </FormControl>
      </form>
    </Wrapper>
  );
};

export default withApollo(Register);
