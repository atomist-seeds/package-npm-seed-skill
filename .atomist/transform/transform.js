const fs = require("fs-extra");

exports.transform = async (p, params) => {

    const ownerOrAtomist = p.id.owner === "atomist-skills" ? "atomist" : p.id.owner;

    const skillTs = (await fs.readFile(p.path("skill.ts"))).toString()
        .replace(/name:\s*".*seed"/g, `name: "${p.id.repo.toLowerCase()}"`)
        .replace(/namespace:\s*".*"/g, `namespace: "${ownerOrAtomist.toLowerCase()}"`)
        .replace(/displayName:\s*"Seed.*"/g, `displayName: "${params.displayName}"`)
        .replace(/author:\s*".*"/g, `author: "${p.id.owner}"`)
        .replace(/homepageUrl:\s*".*"/g, `homepageUrl: "https://github.com/${p.id.owner}/${p.id.repo}"`)
        .replace(/repositoryUrl:\s*".*"/g, `repositoryUrl: "https://github.com/${p.id.owner}/${p.id.repo}.git"`);
    await fs.writeFile(p.path("skill.ts"), skillTs);

    const readmeMd = (await fs.readFile(p.path("README.md"))).toString()
        .replace(/atomist\//g, `${ownerOrAtomist.toLowerCase()}/`)
        .replace(/atomist-seeds\//g, `${p.id.owner.toLowerCase()}/`)
        .replace(/typescript-skill-seed/g, `${p.id.repo.toLowerCase()}`)
        .replace(/<!---atomist-skill-description:start--->[\s\S]*<!---atomist-skill-description:end--->/g, `<!---atomist-skill-description:start--->\n\n${params.description}\n\n<!---atomist-skill-description:end--->`);
    await fs.writeFile(p.path("README.md"), readmeMd);
};
