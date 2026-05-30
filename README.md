# Leo XIV Encyclical — A novelty MCP Server for the Social Doctrine

> **This was made entirely for fun (and in self-aware irony by AI) as a nice way to break down and read the points the Pope has intended. Don't take it too seriously.**

---

41 Claude agent skills drawn from Pope Leo XIV's encyclical on technology, AI, and human dignity — paragraphs §90 through §130. Each paragraph becomes its own skill that prompts ethical reflection when building software or answering questions touching on technology and society.

*"...the most extraordinary scientific progress, the most astounding technical feats and the most amazing economic growth, unless accompanied by authentic moral and social progress, will in the long run go against man.”* — Saint Paul VI, Address on the occasion of the 25th Anniversary of the FAO (16 November 1970)

## What this is

Pope Leo XIV's encyclical dedicates its third chapter to the moral and societal challenges of AI and emerging technology. Each paragraph §90–§130 articulates a distinct ethical principle — on power, dignity, accountability, care, human limits, data, governance, and what it means to build technology that serves rather than dominates.

This project packages each of those principles as a [Claude agent skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview), following Anthropic's SKILL.md pattern. The MCP server exposes them as searchable resources so Claude can surface the relevant principle when you're designing a system, writing code, or thinking through a hard question.

## Skills (§90–§130)

| Paragraph | Skill | Theme |
|-----------|-------|-------|
| §90 | `leo-90-building-wisely` | Babel vs. Jerusalem — what are we building? |
| §91 | `leo-91-embrace-responsibility` | Engage challenges without fear |
| §92 | `leo-92-resist-technocracy` | Efficiency is not the measure of everything |
| §93 | `leo-93-new-ethical-framework` | Greater power demands greater ethics |
| §94 | `leo-94-progress-needs-moral-growth` | "Having more" ≠ "being more" |
| §95 | `leo-95-digital-power-concentration` | Challenge concentrated digital power |
| §96 | `leo-96-social-doctrine-criteria` | Six criteria: dignity, common good, subsidiarity, solidarity, universal destination, justice |
| §97 | `leo-97-human-primacy-over-ai` | Human conscience must guide AI |
| §98 | `leo-98-ai-discernment-required` | AI is cultivated, not built — epistemic humility required |
| §99 | `leo-99-ai-not-human-intelligence` | AI imitates; it does not understand |
| §100 | `leo-100-vigilant-personal-ai-use` | Three vigilances: ease, false objectivity, simulated intimacy |
| §101 | `leo-101-ai-environmental-impact` | AI has a real environmental cost |
| §102 | `leo-102-ai-decisions-affect-rights` | Automated decisions touch rights, not just efficiency |
| §103 | `leo-103-algorithmic-accountability` | Someone must be accountable for every decision |
| §104 | `leo-104-ai-not-morally-neutral` | Every tool embeds values |
| §105 | `leo-105-ai-accountability-chain` | Identify, justify, monitor, remedy |
| §106 | `leo-106-prudent-ai-adoption` | Slowness can be responsible care |
| §107 | `leo-107-democratic-ai-ethics` | AI ethics needs democratic governance, not just alignment |
| §108 | `leo-108-data-as-common-good` | Data belongs to its contributors |
| §109 | `leo-109-social-doctrine-ai-framework` | Social doctrine applied to AI in full |
| §110 | `leo-110-disarm-ai` | Free AI from the competitive arms race |
| §111 | `leo-111-developer-responsibility` | Developers bear particular ethical responsibility |
| §112 | `leo-112-safeguard-humanity` | Resist anti-human normalization |
| §113 | `leo-113-balance-human-faculties` | Intelligence is not the measure of everything |
| §114 | `leo-114-care-as-fundamental` | A civilization is measured by its care |
| §115 | `leo-115-transhumanist-assumptions` | Name the ideological background |
| §116 | `leo-116-posthumanism-critique` | Critique visions that create hierarchies of worth |
| §117 | `leo-117-human-centered-vs-enhancement` | Human-centered vs. enhancement-centered |
| §118 | `leo-118-accept-human-limits` | Limits are not defects |
| §119 | `leo-119-compassion-through-limits` | Compassion emerges from limitation |
| §120 | `leo-120-integrate-suffering` | Integrate difficulty rather than eliminate it |
| §121 | `leo-121-dignity-persists-in-failure` | Dignity survives moral failure |
| §122 | `leo-122-finitude-opens-to-dignity` | Accepting finitude opens us to universal dignity |
| §123 | `leo-123-build-just-institutions` | Moral progress requires patient institution-building |
| §124 | `leo-124-individual-witness-matters` | Individuals taking dignity seriously change history |
| §125 | `leo-125-hidden-witnesses` | Honor the martyrs of everyday life |
| §126 | `leo-126-humanity-not-replaceable` | Human relationship and love cannot be replaced |
| §127 | `leo-127-grace-not-technology` | Authentic transcendence is through grace, not optimization |
| §128 | `leo-128-freedom-and-error` | A person's future is not calculable |
| §129 | `leo-129-technology-ordered-to-good` | Does this make human life more human? |
| §130 | `leo-130-two-loves` | Which love guides this decision? |

## Using with Claude Code

Place the `skills/` directory (or symlink it) into your project's `.claude/skills/` folder. Claude will automatically discover the skills and invoke them when relevant topics arise.

```bash
mkdir -p .claude/skills
cp -r /path/to/leo/skills/* .claude/skills/
```

## Running the MCP Server

```bash
npm install
npm run build
node dist/index.js
```

The server exposes two tools:
- `find_leo_principles` — search for principles relevant to a topic
- `list_all_principles` — list all 41 skills

And all 41 skills as resources at `skill://leo/<directory-name>`.

---

## Disclaimer

**This software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software. Use at your own risk.**

This project is an independent interpretation of publicly available text for educational and reflective purposes. It is not affiliated with, endorsed by, or representative of the Holy See, the Vatican, or any Catholic institution.
