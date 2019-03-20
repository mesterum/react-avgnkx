import React, { useState,useEffect } from "react";

const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue.text);
// console.log(value+initialValue)
  useEffect(()=>{
    setValue(initialValue.text)
    // console.log(initialValue)
  },[initialValue])
  return {
    value,
    onChange: e => setValue(e.target.value),
    resetValue: () => setValue("")
  };
};

export default ({ onSubmit, children, value}) => {
  const { resetValue, ...text } = useInputValue(value);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(text.value);
        // resetValue();
      }}
    >
      <input {...text} />{children}
    </form>
  );
};
