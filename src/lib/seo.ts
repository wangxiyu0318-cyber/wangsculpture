import type { Project } from "../data/projects";

export const homeDescription = "Xiyu Wang is a sculptor working across wood, metal, paper and installation, exploring body, memory, religious imagery, material transformation and cultural belonging.";

// Short summaries based on the artist's existing project descriptions.
const summaries: Record<string, string> = {
  somira: "Somira is a large-scale camphor wood sculpture by Xiyu Wang, inspired by a dual-bodied Bishamonten and the boundary between life and death.",
  "four-gates-pagoda": "Four-Gates Pagoda by Xiyu Wang uses paper and bamboo to explore religious imagery, memories of home, and the fragile nature of longing.",
  niou: "NIOU, camphor wood guardian figures by Xiyu Wang for Miyaji Shrine in Kumamoto, brings Buddhist sculptural traditions together with local sumo customs.",
  "nezhas-bike": "Nezha’s Bike, an iron and camphor wood sculpture by Xiyu Wang, draws on the myth of Nezha to imagine freedom from patriarchal power.",
  minira: "MINIRA, a camphor wood sculpture by Xiyu Wang, explores growing up, questioning parental decisions, and the tension between distance and resemblance.",
  cave: "CAVE, a camphor wood sculpture by Xiyu Wang formed from handprint shadows, reflects on the surrounding influences that shape consciousness and the self.",
};

export function projectDescription(project: Project, language: "en" | "zh") {
  if (language === "zh") {
    return `${project.title}，Xiyu Wang 的雕塑作品（${project.year}）。材料：${project.materials}。查看作品图片、尺寸与详细信息。`;
  }
  return summaries[project.slug] ?? `${project.title} (${project.year}), a sculpture by Xiyu Wang in ${project.materials.charAt(0).toLowerCase() + project.materials.slice(1)}. View artwork photographs, materials and dimensions.`;
}
