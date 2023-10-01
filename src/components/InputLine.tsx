import { useState } from "react";

interface InputLine {
  submit: (message: string) => void;
  label: string;
  submitLabel: string;
}

export default function InputLine({ submit, label, submitLabel }: InputLine) {
  const [value, setValue] = useState("");

  function submitAndClear(value: string) {
    if (value != "") {
      submit(value);
    }
    
    setValue("");
  }

  return (
    <form className="row" autoComplete="off">
      <div className="col-auto">
        <label htmlFor="message" className="col-form-label">
          {label}
        </label>
      </div>
      <div className="col">
        <input type="text" className="form-control" id="message"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key == "Enter") {
              submitAndClear(value);

              e.preventDefault();
            }
          }} />
      </div>
      <div className="col-auto">
        <button type="button" className="btn btn-primary w-100" onClick={() => submitAndClear(value)}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}