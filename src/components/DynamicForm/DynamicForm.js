import React, { useState } from "react";
import "./form.css";
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
                console.log('Answer By User', values)
                //  Logic Implementing on See More functionality, matching user's answer and see more object key
                Object.entries(questionData).forEach(([questionKey, question]) => {
                  const { show_more: showMore, answers } = question;
                  if (showMore && typeof showMore === "object" && Object.keys(showMore).length > 0) {
                    Object.entries(showMore).forEach(([showMoreKey, showMoreValues]) => {
                      const matchingKey = Object.keys(questionData).find((key) =>
                        showMoreValues.includes(key)
                      );
                      const matchingObject = questionData[matchingKey];
                      console.log("matchingObject", matchingObject);
                      if (matchingObject) {
                        const selectedAnswers = values[questionKey] || []; // Get the selected answer values as an array
                        const matchingAnswers = Object.keys(answers).filter((answerKey) =>
                          selectedAnswers.includes(answers[answerKey])
                        );
                        console.log("matchingAnswers", matchingAnswers);
                        // If user's answer and see more object ki values matches, visibility should be true
                        if (matchingAnswers.includes(showMoreKey)) {
                          // matchingObject.visibility = true ; // Update visibility to true
                        }
                      }
                    });
                  }
                });
                // Other fields should be disabled if my answer for this field is No, as its required for this
                const errorKeys = Object.keys(errors);
                const isDisabled = errorKeys.some(
                  (errorKey) => questionKey !== errorKey && !!errors[errorKey]
                );
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
