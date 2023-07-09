import React, { useState } from "react";
import './form.css'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import questionData from "../mock-data/dataset.json";
import Question from "./Questions";

const DynamicForm = () => {
  // Will be Generating initial form values and validation schema 
  const initialFormValues = {};
  const validationSchema = Yup.object().shape(
    Object.entries(questionData).reduce((schema, [questionKey, question]) => {
      if (!question.visibility) return schema;
      initialFormValues[questionKey] = "";
      if (question.validation && question.validation.required_value) {
        schema[questionKey] = Yup.string().oneOf(
          [question.validation.required_value],
          question.validation.message
        );
      }
      return schema;
    }, {})
  );
  // Consoling values onSubmit my form
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      console.log(values);
      alert("Your form submitted successfully, Check values in console");
      // Reset the form after successful submission
      resetForm();
    } catch (errors) {
      console.error(errors);
      alert("Please fill in the required fields correctly.");
    }
  };
  return (
    <div className="_parent-wrapper">
      <div className="_form-style">
        <h1>Questionnaire</h1>
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleChange }) => (
            <Form>
              {Object.keys(questionData).map((questionKey) => {
                const question = questionData[questionKey];
                if (!question.visibility) return null;

                // Other fields should be disabled if my answer for this field is No, as its required for this 
                const isDisabled =
                  questionKey !=="Are_you_looking_for_academic_support_in_university" &&
                  !!errors[
                    "Are_you_looking_for_academic_support_in_university"
                  ];
                return (
                  <Question
                    key={questionKey}
                    question={question}
                    name={questionKey}
                    handleChange={handleChange}
                    errors={errors}
                    isDisabled={isDisabled}
                  />
                );
              })}
              <button
                type="submit"
                className="_submit-btn"
                disabled={Object.keys(errors).length > 0}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DynamicForm;
