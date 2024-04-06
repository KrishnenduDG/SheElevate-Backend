import { WORKSPACE_DEFAULT_COVER_PIC_URL_ARRAY } from "../constants.js";

const getRandomElementFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

export const getDefaultWorkspaceCoverPic = () =>
  getRandomElementFromArray(WORKSPACE_DEFAULT_COVER_PIC_URL_ARRAY);
