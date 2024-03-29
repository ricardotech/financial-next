import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
    name: string;
    label?: string;
    error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> 
  = ({ name, label, error = null, ...rest }, ref) => {
    return (
        <FormControl isInvalid={!!error}>
            { !!label && <FormLabel color="#333" mt="3" htmlFor={name}>{label}</FormLabel> }

            <ChakraInput
              name={name} 
              id={name}
              color="#333"
              type="email"
              focusBorderColor="#7034c6"
              size="lg"
              ref={ref}
              {...rest}
            />

            { !!error && (
              <FormErrorMessage>
                {error.message}
              </FormErrorMessage>
            ) }
        </FormControl>
    );
}

export const Input = forwardRef(InputBase);