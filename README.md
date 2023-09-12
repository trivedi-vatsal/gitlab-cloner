## Gitlab-cloner 

A utility to clone and pull GitLab groups, subgroups, projects based on user access token

### Installation

Installing from source:
```bash
git clone https://github.com/trivedi-vatsal/gitlab-cloner.git
cd gitlab-cloner
npm install
```

### Gitlab access token:

To gain access to GitLab, you'll need to create a personal access token, which you can learn how to generate from this [link](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).

In order to list all the repositories or projects within a GitLab group using the API, you'll need specific permissions. In newer GitLab versions, there's a dedicated permission called "read_api" designed for this purpose. However, if you're working with an older version, like the one you mentioned, you'll need to utilize the more general "api" permission, which encompasses both read and write access. Since your use case only requires read access and doesn't involve write access, it's advisable to opt for the broader "api" permission just to be safe.

Additionally, you should locate the `constants.js` file within your project's directory and make the necessary modifications to it. This file is used by the utility responsible for fetching repositories from GitLab, and you'll need to adjust its settings according to your needs.

Example constants values:

```javascript
const constants = {
  gitlab_username: "vatsal",
  gitlab_token: "glpat-xxxxxxxxxxxxxxxx",
};
```

### Usage

```bash
npm run fetch
```

After generating the projects.json file containing the information you mentioned (name, ssh_url_to_repo, http_url_to_repo, web_url, and clone_command), you can use the following command to clone all the repositories listed in the JSON file:

For HTTP URL:
```bash
$ cat projects.json | jq ".[].http_url" -r | xargs -I {} git clone {}
```

For SSH URL:
```bash
$ cat projects.json | jq ".[].ssh_url" -r | xargs -I {} git clone {}
```




### License

MIT