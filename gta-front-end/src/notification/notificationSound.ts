import successMP3 from "../../notification-sounds/success.mp3";
import failedMP3 from "../../notification-sounds/failed.mp3";
import warningMP3 from "../../notification-sounds/warning.mp3";

export const PlayNotification = (type: "success" | "warning" | "failed") => {
  let audioType;

  switch (type) {
    case "success":
      audioType = successMP3;
      break;
    case "warning":
      audioType = warningMP3;
      break;
    case "failed":
      audioType = failedMP3;
      break;

    default:
      break;
  }

  const audioElement = new Audio(audioType);
  return audioElement.play();
};
