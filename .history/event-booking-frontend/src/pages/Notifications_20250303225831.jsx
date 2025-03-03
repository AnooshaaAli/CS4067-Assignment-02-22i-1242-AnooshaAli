import { useEffect } from "react";

const Notifications = ({ userId }) => {
  console.log("Received userId in Notifications:", userId);

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId is undefined in Notifications!");
    }
  }, [userId]);

  return <div>Notifications</div>;
};

export default Notifications;
