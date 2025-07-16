const { Octokit } = require("octokit");
const { GitHub_API_Client } = require("./main");

// const client = new Octokit();


const owner = "IT-College-Okinawa"; // 所有者(ユーザー/組織)
const repo = "IT-College-Okinawa.github.io"; // リポジトリ
const branch = "main"; // ブランチ

(async () => {


    const client = new GitHub_API_Client();
    const branchs = await client.getBranchList(owner, repo);
    if (!branchs) return console.log("not branches");

    return console.log(branchs)


    const branch = branchs.find(b => b.name == "main");
    if (!branch) return console.log("not branch");


    const tree = await client.getTree(owner, repo, branch.commit.sha);
    if (!tree) return console.log("not tree");


    const file = tree.tree.find(f => f.path == "README.md" && f.type == "blob");
    if (!file) return console.log("not file");

    
    const blob = await client.getBlob(owner, repo, file.sha);
    if (!blob) return console.log("not blob");


    const content = Buffer.from(blob.content, blob.encoding).toString();
    


})()

// client.auth().then(async (v) => {
//     console.log(v)
//     // const files = (await client.rest.git.getTree({ owner, repo, tree_sha: latestCommit.sha })).data.tree;
//     // const blob = (await client.rest.git.getBlob({ owner, repo, file_sha: files.find(file => file.path === "README.md")?.sha })).data;
//     // const content = Buffer.from(blob.content, "base64").toString("utf-8");
//     // console.log(content);
// })

// (async () => {

//     const latestCommit = (await client.rest.repos.getBranch({ owner, repo, branch })).data.commit;
//     const files = (await client.rest.git.getTree({ owner, repo, tree_sha: latestCommit.sha })).data.tree;
//     const blob = (await client.rest.git.getBlob({ owner, repo, file_sha: files.find(file => file.path === "README.md")?.sha })).data;
//     const content = Buffer.from(blob.content, "base64").toString("utf-8");
//     console.log(content);
// })()
