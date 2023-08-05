import React, { useState } from "react";
import { useField } from "formik";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputField = ({ ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 確認是否為password
  const isPasswordType = props.type === "password";
  const value = field.value !== undefined ? field.value : "";

  return (
    <>
      <TextField
        className="mui_input_custom"
        {...props}
        {...field}
        variant="standard"
        value={value}
        error={meta.error && true}
        helperText={meta.error}
        type={
          isPasswordType ? (showPassword ? "text" : "password") : props.type
        }
        InputProps={
          isPasswordType
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            : undefined
        }
      />
    </>
  );
};

export default InputField;
