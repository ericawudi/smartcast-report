import Cookies from "universal-cookie";
import axios from "axios";
import { Constants } from "../assets/constants";

const cookies = new Cookies();

const APIAxios = axios.create({
  baseURL: Constants.App.BASE_API_URL,
});

// Check if logged in
export function isAuthenticated() {
  if (cookies.get(Constants.App.API_ACCESS)) {
    return true;
  } else {
    return false;
  }
}
// Get privilege
export function GetPrivilege() {
  if (cookies.get(Constants.App.API_ACCESS)) {
    return cookies.get(Constants.App.API_ACCESS);
  }
}

// Log user out
export const Logout = () => {
  cookies.remove(Constants.App.API_ACCESS, { path: "/" });
};

// Get all Competions and categories
export const TestAPI = async () => {
  const resp = await APIAxios.get()
    .then((resp) => resp)
    .catch((err) => err.response);
  return resp;
};

// Login
export const LogUserIn = async (data) => {
  const dataToSend = new FormData();

  dataToSend.append("username", data.username);
  dataToSend.append("password", data.password);
  dataToSend.append("action", "login");

  const resp = await APIAxios({
    method: "POST",
    url: "/server.php",
    data: dataToSend,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((resp) => {
      cookies.set(
        Constants.App.API_ACCESS,
        { username: data.username, privilege: resp.data[0].privilege },
        {
          path: "/",
        }
      );
      return resp;
    })
    .catch((err) => err.response);
  return resp;
};

// Login
export const SignUpUser = async (data, accountType) => {
  const resp = await APIAxios({
    method: "GET",
    url: "/server.php",
    params: {
      username: data.username,
      password: data.password,
      key: data.authkey,
      privilege: parseInt(accountType, 10),
      action: "createUser",
    },
  })
    .then((resp) => {
      cookies.set(
        Constants.App.API_ACCESS,
        { username: data.username, privilege: parseInt(accountType, 10) },
        {
          path: "/",
        }
      );
      return resp;
    })
    .catch((err) => err.response);
  return resp;
};

// Get all Competions and categories
export const GetCompetions = async () => {
  const resp = await APIAxios.get()
    .then((resp) => resp)
    .catch((err) => err.response);
  return resp;
};

// Get all Competions and categories
export const GetCategories = async () => {
  const resp = await APIAxios.get()
    .then((resp) => resp)
    .catch((err) => err.response);
  return resp;
};

// Get all votes for today
export const GetCurrentVote = async () => {
  const resp = await APIAxios.get()
    .then((resp) => resp)
    .catch((err) => err.response);
  return resp;
};

// Get Category and votes
export const GetAllVotes = async (data) => {
  const storedData = cookies.get(Constants.App.API_ACCESS);
  const resp = await APIAxios({
    method: "GET",
    url: "/server.php",
    params: {
      username: storedData.username,
      privilege: storedData.privilege,
      categoryID: data.categoryID,
      date: data.date,
      startDate: data.startDate,
      endDate: data.endDate,
      action: "fetchCategory",
    },
  })
    .then((resp) => {
      const response = {
        data: resp.data[0],
        status: resp.status,
        votes: resp.data[1][0].votes,
      };
      return response;
    })
    .catch((err) => err.response);
  return resp;
};

// Fetch Competions with Categories and vote
export const GetCompetitionsAndCategoryVotes = async (
  data,
  selectedCategory,
  categoryList
) => {
  const storedData = cookies.get(Constants.App.API_ACCESS);

  if (selectedCategory === "all" || selectedCategory === "") {
    const resp = await APIAxios({
      method: "GET",
      url: "/server.php",
      params: {
        username: storedData.username,
        privilege: storedData.privilege,
        competitionID: data.competitionID,
        startDate: data.startDate,
        endDate: data.endDate,
        action: "fetchCompetitions",
      },
    })
      .then((resp) => {
        const response = {
          data: resp.data[1],
          status: resp.status,
          category: resp.data[0],
          votes: resp.data[2][0].votes,
        };
        return response;
      })
      .catch((err) => err.response);
    return resp;
  } else {
    const resp = await APIAxios({
      method: "GET",
      url: "/server.php",
      params: {
        username: storedData.username,
        privilege: storedData.privilege,
        competitionID: data.competitionID,
        date: data.date,
        startDate: data.startDate,
        endDate: data.endDate,
        selectedCategory: selectedCategory,
        action: "fetchCompetitionsWithCategory",
      },
    })
      .then((resp) => {
        const response = {
          data: resp.data[0],
          status: resp.status,
          category: categoryList,
          votes: resp.data[1][0].votes,
        };
        return response;
      })
      .catch((err) => err.response);
    return resp;
  }
};

// Get votes by category
export const GetVotesByCategory = async (ID, action) => {
  const storedData = cookies.get(Constants.App.API_ACCESS);
  const resp = await APIAxios({
    method: "GET",
    url: "/server.php",
    params: {
      username: storedData.username,
      privilege: storedData.privilege,
      action: action,
      competitionID: action === "getAllVote" ? ID : "",
      categoryID: action === "getAllCategoryVote" ? ID : "",
    },
  })
    .then((resp) => resp)
    .catch((err) => err.response);
  return resp;
};
