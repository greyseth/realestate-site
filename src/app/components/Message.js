import { useEffect, useState } from "react";

//Type: 'success', 'error', or 'notice'
//Message: anything you want to put in
//buttons: [{display, action}]
export default function Message({ type, message, buttons }) {
  const [className, setClassName] = useState("");
  const buttonClassInitial = "primary-btn hover scale to-tertiary-fg";
  const [buttonClass, setButtonClass] = useState(buttonClassInitial);

  useEffect(() => {
    switch (type) {
      case "success":
        setButtonClass(buttonClassInitial);
        setClassName("message-container success");
        break;
      case "error":
        setButtonClass("secondary-btn white hover scale");
        setClassName("message-container error");
        break;
      default:
        setButtonClass(buttonClassInitial);
        setClassName("message-container notice");
        break;
    }
  }, [type]);

  return (
    <div className={className}>
      <p className="message-heading"></p>
      <p className="message-content">{message}</p>
      {buttons.map((btn, i) => {
        return (
          <button
            key={i}
            className={buttonClass}
            style={{ padding: "1em", borderRadius: "10px" }}
            onClick={btn.action}
          >
            {btn.display}
          </button>
        );
      })}
    </div>
  );
}
