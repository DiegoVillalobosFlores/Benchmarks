"use client";

import { useState } from "react";

type Props = {
  initialValue: string;
};

export default function Input({ initialValue }: Props) {
  const [text, setText] = useState(initialValue);

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <input id="text" type="text" value={text} onChange={handleChange} />
    </div>
  );
}
