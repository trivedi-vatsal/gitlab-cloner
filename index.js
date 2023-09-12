const constants = require("./constants");
const axios = require("axios");
const fs = require("fs");
const { loading } = require("cli-loading-animation");
const { start, stop } = loading("Fecthing..");

let logger = fs.createWriteStream("projects.json", { flags: "w" });

const username = constants.gitlab_username || "";
const token = constants.gitlab_token || "";

const gitlabCloner = async () => {
  try {
    start();

    if (username == "" || token == "") {
      console.log(
        "Required parameters not set : Gitlab username, Gitlab token. Please set in constants file."
      );
      return -1;
    }

    const request = {
      url: "https://gitlab.com/api/v4/groups/",
      method: "GET",
      headers: {
        "PRIVATE-TOKEN": token,
      },
    };

    let gitlabRepos = [];

    await axios(request)
      .then(async (response) => {
        if (response.data) {
          for (let i = 0; i < response.data.length; i++) {
            let temp = response.data[i];
            let gitlabParseResp = await gitlabParseGroup(temp.id);

            gitlabRepos = [...gitlabRepos, ...gitlabParseResp];
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });

    logger.write(JSON.stringify(gitlabRepos, null, 2));

    return 1;
  } catch (e) {
    console.log(e);
    return -1;
  } finally {
    stop();
  }
};

const gitlabParseGroup = async (id = -1) => {
  try {
    if (id == -1) {
      return [];
    }
    const request = {
      url: `https://gitlab.com/api/v4/groups/${id}`,
      method: "GET",
      headers: {
        "PRIVATE-TOKEN": token,
      },
    };

    let gitlabRepos = [];
    await axios(request)
      .then((response) => {
        if (response.data) {
          if (response.data) {
            let group = response.data;
            if (group.projects && group.projects.length > 0) {
              let projects = group.projects;
              for (let i = 0; i < projects.length; i++) {
                let project = projects[i];

                gitlabRepos.push({
                  name: project.name || "",
                  ssh_url_to_repo: project.ssh_url_to_repo || "",
                  http_url_to_repo: project.http_url_to_repo || "",
                  web_url: project.web_url || "",
                  clone_command:
                    "git clone " +
                      project.http_url_to_repo.replace(
                        "https://",
                        `https://${username}:${token}`
                      ) || "",
                });
              }
            }
          }
        }
      })
      .catch((e) => {
        console.log(e);
        return [];
      });

    return gitlabRepos;
  } catch (e) {
    console.log(e);
    return [];
  }
};

gitlabCloner();
