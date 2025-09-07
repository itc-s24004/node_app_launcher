const { Octokit } = require("octokit");

const client = new Octokit();

class GitHub_API_Client {
    #tmpDir
    #key
    #client

    constructor(tmpDir, key) {
        this.#client = new Octokit({})
        
    }


    async getRepository(owner, repo) {
        const res = await this.#client.request(`GET /repos/${owner}/${repo}`, {
            owner: 'OWNER',
            repo: 'REPO',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }

    /**
     * 
     * @param {*} owner 
     * @param {*} repo 
     * @returns {Promise.<import("./GitHubAPI_Response").GitHubAPI_Response_Branch[] | undefined>}
     */
    async getBranchList(owner, repo) {
        const res = await this.#client.request(`GET /repos/${owner}/${repo}/branches`, {
            owner: 'OWNER',
            repo: 'REPO',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }


    /**
     * 
     * @param {*} owner 
     * @param {*} repo 
     * @param {*} tree_sha 
     * @returns {Promise.<import("./GitHubAPI_Response").GitHubAPI_Response_Tree | undefined>}
     */
    async getTree(owner, repo, tree_sha) {
        const res = await this.#client.request(`GET /repos/${owner}/${repo}/git/trees/${tree_sha}`, {
            owner: 'OWNER',
            repo: 'REPO',
            tree_sha: 'TREE_SHA',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }


    /**
     * 
     * @param {*} owner 
     * @param {*} repo 
     * @param {*} file_sha 
     * @returns {Promise.<import("./GitHubAPI_Response").GitHubAPI_Response_Blob | undefined>}
     */
    async getBlob(owner, repo, file_sha) {
        const res = await this.#client.request(`GET /repos/${owner}/${repo}/git/blobs/${file_sha}`, {
            owner: 'OWNER',
            repo: 'REPO',
            tree_sha: 'TREE_SHA',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }




    async getReleases(owner, repo) {
        const res = await this.#client.request(`GET /repos/${owner}/${repo}/releases`, {
            owner: 'OWNER',
            repo: 'REPO',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }






//////////////////////////////////////////////////////////////
    /**互換バージョン */
    static get version() {
        return 0;
    }
    /**修正バージョン */
    static get release() {
        return 1;
    }


    static download(url) {}

    /**
     * 
     * @param {string} owner 
     * @param {string} repo 
     * @returns {Promise.<import("./res/branches").branches | undefined>}
     */
    static async getBranchList(owner, repo) {
        const res = await client.request(`GET /repos/${owner}/${repo}/branches`, {
            owner: 'OWNER',
            repo: 'REPO',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).catch(() => undefined);
        if (res && res.status == 200) return res.data;
    }

}


exports.GitHub_API_Client = GitHub_API_Client;
