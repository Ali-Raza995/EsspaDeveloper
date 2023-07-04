import { Field } from "formik";
import questionData1 from "../mock-data/dataset.json";

const Question = ({
  question,
  name,
  handleChange,
  errors,
  isDisabled,
}) => {
  const { label, type, answers } = question;
  return (
    <div className="form-fields">
      {/* Label for questions */}
      <label>{label}</label>
      {Object.entries(answers).map(([answerKey, answer]) => (
        <div key={answerKey}>
          <Field
            type={type}
            name={name}
            value={answerKey}
            onChange={handleChange}
            disabled={isDisabled}
          />
          <label>{answer}</label>
        </div>
      ))}
      {/* Error if academy support is none */}
      {errors[name] && (
        <div className="error" style={{ color: "red" }}>
          {errors[name]}
        </div>
      )}
    </div>
  );
};

export default Question;
