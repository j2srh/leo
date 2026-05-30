#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillsDir = join(__dirname, "..", "skills");

interface SkillMeta {
  name: string;
  description: string;
  directory: string;
}

function parseSkillMeta(content: string, directory: string): SkillMeta {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { name: directory, description: "", directory };
  const yaml = match[1];
  const nameLine = yaml.match(/^name:\s*(.+)$/m);
  const descLine = yaml.match(/^description:\s*([\s\S]+?)(?=\n\w|\n---)/m);
  return {
    name: nameLine ? nameLine[1].trim() : directory,
    description: descLine ? descLine[1].replace(/\n\s+/g, " ").trim() : "",
    directory,
  };
}

function getAllSkills(): SkillMeta[] {
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => {
      const content = readFileSync(join(skillsDir, d.name, "SKILL.md"), "utf-8");
      return parseSkillMeta(content, d.name);
    });
}

function readSkillContent(directory: string): string {
  return readFileSync(join(skillsDir, directory, "SKILL.md"), "utf-8");
}

const server = new Server(
  { name: "leo-encyclical-skills", version: "1.0.0" },
  { capabilities: { resources: {}, tools: {} } }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const skills = getAllSkills();
  return {
    resources: skills.map((skill) => ({
      uri: `skill://leo/${skill.directory}`,
      name: skill.name,
      description: skill.description.slice(0, 200),
      mimeType: "text/markdown",
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  const uri = req.params.uri;
  const match = uri.match(/^skill:\/\/leo\/(.+)$/);
  if (!match) {
    throw new McpError(ErrorCode.InvalidRequest, `Invalid skill URI: ${uri}`);
  }
  const directory = match[1];
  const skillPath = join(skillsDir, directory, "SKILL.md");
  if (!existsSync(skillPath)) {
    throw new McpError(ErrorCode.InvalidRequest, `Skill not found: ${directory}`);
  }
  return {
    contents: [{ uri, mimeType: "text/markdown", text: readSkillContent(directory) }],
  };
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "find_leo_principles",
      description:
        "Search the Leo XIV encyclical skills for ethical principles relevant to a topic, question, or software design decision. Returns the most relevant principles from Pope Leo XIV's teaching on technology, AI, and human dignity.",
      inputSchema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description:
              "The topic, question, or design decision to find relevant ethical principles for (e.g., 'AI decision making', 'data ownership', 'developer responsibility')",
          },
        },
        required: ["topic"],
      },
    },
    {
      name: "list_all_principles",
      description:
        "List all 41 ethical principles from Leo XIV's encyclical on technology and AI, organized by paragraph number, with their names and brief descriptions.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === "list_all_principles") {
    const skills = getAllSkills();
    const list = skills
      .map(
        (s, i) =>
          `${i + 1}. **${s.name}**\n   ${s.description.slice(0, 150)}...\n   URI: skill://leo/${s.directory}`
      )
      .join("\n\n");
    return { content: [{ type: "text", text: list }] };
  }

  if (req.params.name === "find_leo_principles") {
    const args = req.params.arguments as { topic: string };
    if (!args?.topic) {
      throw new McpError(ErrorCode.InvalidParams, "topic is required");
    }
    const topic = args.topic.toLowerCase();
    const skills = getAllSkills();
    const keywords = topic
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .concat([topic]);

    const scored = skills.map((skill) => {
      const content = readSkillContent(skill.directory).toLowerCase();
      const nameL = skill.name.toLowerCase();
      const descL = skill.description.toLowerCase();
      const score = keywords.reduce((acc, kw) => {
        return (
          acc +
          (nameL.includes(kw) ? 4 : 0) +
          (descL.includes(kw) ? 3 : 0) +
          (content.includes(kw) ? 1 : 0)
        );
      }, 0);
      return { skill, score };
    });

    const relevant = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (relevant.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: [
              `No specific principles found for "${args.topic}". Consider these foundational principles:`,
              "",
              "- **leo-130-two-loves**: Which love guides this decision — neighbor or self? (skill://leo/leo-130-two-loves)",
              "- **leo-96-social-doctrine-criteria**: Apply the six criteria of dignity, common good, subsidiarity, solidarity, universal destination, and justice. (skill://leo/leo-96-social-doctrine-criteria)",
              "- **leo-104-ai-not-morally-neutral**: Every technical tool embeds values. (skill://leo/leo-104-ai-not-morally-neutral)",
            ].join("\n"),
          },
        ],
      };
    }

    const result = [
      `Found ${relevant.length} relevant principle(s) for "${args.topic}":\n`,
      ...relevant.map(
        ({ skill }, i) =>
          `${i + 1}. **${skill.name}**\n   ${skill.description.slice(0, 200)}\n   Read full skill: skill://leo/${skill.directory}`
      ),
    ].join("\n\n");

    return { content: [{ type: "text", text: result }] };
  }

  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${req.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
