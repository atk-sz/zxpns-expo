import { useCallback, useState } from "react";
import { IToastType } from "../utils/interfaces";

const useToastHandler = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<IToastType>("info");

  const showToast = useCallback((msg: string, t: IToastType = "info") => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    // auto-hide after 3 seconds
    setTimeout(() => setVisible(false), 3000);
  }, []);

  return { visible, message, type, showToast };
};

export default useToastHandler;
