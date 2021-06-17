import { notification } from "antd";
const HandleNotification = (type, title, text, position = "topRight") => {
  notification[type]({
    message: title,
    placement: "topRight",
    description: text,
    placement: position,
  });
};
export default HandleNotification;
