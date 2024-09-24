"use server";

import axios from "axios";
import fs from "fs";
import path from "path";

const workspace = "lobadev";
const projectKey = "ZFUNCS";

const auth = {
  username: process.env.BITBUCKET_USERNAME,
  password: process.env.BITBUCKET_PASSWORD,
};

export const bitbucketCreateRepository = async (
  repositoryName,
  description = "",
  isPrivate = true
) => {
  try {
    const response = await axios.post(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repositoryName}`,
      {
        scm: "git",
        description,
        is_private: isPrivate,
        project: { key: projectKey },
      },
      {
        auth,
      }
    );
    console.log("Repository created successfully:", response.data);
    return response.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    throw new Error("Error creating the repository");
  }
};

export const bitbucketGetRepository = async (repositoryName) => {
  try {
    const response = await axios.get(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repositoryName}`,
      {
        auth,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err.response.data);
  }
};

export const bitbucketCommit = async (repositoryName, formData, message) => {
  try {
    formData.append("message", message);
    const response = await axios.post(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repositoryName}/src`,
      formData,
      {
        auth,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    console.log(err.response?.data || err.message);
  }
};
