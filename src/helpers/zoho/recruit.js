"use server";
import axios from "axios";

export const recruitGetFunctions = async (domain, config) => {
  try {
    const url = `https://recruit.zoho.${domain}/recruit/v2/settings/functions?type=org&start=1&limit=50`;
    const { data } = await axios.get(url, { headers: config });
    return data.functions;
  } catch (err) {
    console.log(err.response.data);
    return [];
  }
};

export const recruitGetFunction = async (domain, config, functionId) => {
  try {
    const url = `https://recruit.zoho.${domain}/recruit/v2/settings/functions/${functionId}?language=deluge&category=standalone&source=recruit`;
    const { data } = await axios.get(url, { headers: config });
    return data.functions[0];
  } catch (err) {
    console.log(err.response.data);
    return {};
  }
};
