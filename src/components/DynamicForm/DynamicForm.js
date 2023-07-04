import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FastField } from "formik";
import * as Yup from "yup";
import questionData from "../mock-data/dataset.json";
import Question from "./Questions";

const initialFormValues = {
  Are_you_looking_for_academic_support_in_university: "",
  Are_you_facing_difficulties_with_study_workload: "",
  Are_you_currently_taking_any_tutoring_or_counselling: "",
  What_academic_support_are_you_seeking: [],
  Specify_other_academic_supports_you_are_seeking: "",
  Can_you_attend_regularly_scheduled_tutoring_sessions: "",
};

const validationSchema = Yup.object().shape({
  Are_you_looking_for_academic_support_in_university: Yup.string().oneOf(
    ["YES"],
    "At this time we only assist students looking for academic support."
  ),
  What_academic_support_are_you_seeking: Yup.array(),
  Specify_other_academic_supports_you_are_seeking: Yup.string().matches(
    /^[a-zA-Z0-9\s.,!?]{1,150}$/,
    "Please enter a valid value."
  ),
  Can_you_attend_regularly_scheduled_tutoring_sessions: Yup.string(),
});

const DynamicForm = () => {
  // Consoling values onSubmit my form
  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    alert("You form submmited");
    // Reset the form after submission
    resetForm();
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
              {Object.entries(questionData).map(([questionKey, question]) => {
                if (!question.visibility) return null;
                const isDisabled =
                  questionKey !==
                    "Are_you_looking_for_academic_support_in_university" &&
                  !!errors[
                    "Are_you_looking_for_academic_support_in_university"
                  ];
                return (
                  // Component where components's will exist
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
              {/* Submittin form onclick  */}
              <button type="submit" className="_submit-btn">
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
