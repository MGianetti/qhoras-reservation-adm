import * as Yup from "yup";

export const validationSchema = Yup.object({
  password: Yup.string()
    .required("Senha é obrigatória")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "A senha deve ter no mínimo 8 caracteres, contendo letras e números.",
    ),
  confirmPassword: Yup.string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([Yup.ref("password")], "As senhas não correspondem"),
});
