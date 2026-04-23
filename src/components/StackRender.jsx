import StackIcon from "tech-stack-icons";
import axiosLogo from "../assets/axios-logo.png";

function StackRender({ stack }) {
  return (
    <div className="flex items-center gap-3">
      {stack.id === "axios" ? (
        <img
          src={axiosLogo}
          alt=""
          aria-hidden="true"
          className="h-7 w-7 md:h-8 md:w-8 xl:h-9 xl:w-9"
        />
      ) : (
        <StackIcon
          className="h-7 w-7 md:h-8 md:w-8 xl:h-9 xl:w-9"
          variant="dark"
          name={`${stack.photo}`}
        />
      )}

      <span className="text-lg">{stack.label}</span>
    </div>
  );
}

export default StackRender;
