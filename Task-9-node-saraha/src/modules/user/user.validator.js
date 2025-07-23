//  انا لسه يعتبر معملتش كل حاجه 


import joi from "joi";
import { GENDER } from "../../utils/constant.js";
export const signupSchema = {
  body: joi
    .object({
      name: joi.string().required(),
      email: joi
        .string()
        .email({
          tlds: {
            allow: true,
          },
          //   minDomainSegments: 1,
        })
        .required(),
      password: joi.string().required(),
      cpassword: joi.string().valid(joi.ref("password")).required(),
      gender: joi.string().valid(GENDER.female, GENDER.male).required(),
      age: joi.number().min(18).max(60).integer().positive().required(),
      phone: joi
        .string()
        .pattern(/^01[0125][0-9]{8}$/)
        .required(),
    })
    .required(),
};

export const loginSchema = {
  body: joi
    .object({
      email: joi
        .string()
        .email({
          tlds: {
            allow: true,
          },
          //   minDomainSegments: 1,
        })
        .required(),
      password: joi.string().required(),
    })
    .required(),
};
