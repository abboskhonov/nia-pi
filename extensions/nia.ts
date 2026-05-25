import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { niaListSourcesTool } from "../lib/tools/nia-list-sources";
import { niaIndexSourceTool } from "../lib/tools/nia-index-source";
import { niaSearchTool } from "../lib/tools/nia-search";
import { niaWebSearchTool } from "../lib/tools/nia-web-search";
import { niaPackageSearchTool } from "../lib/tools/nia-package-search";
import { niaOracleTool } from "../lib/tools/nia-oracle";

function nia(pi: ExtensionAPI): void {
  pi.registerTool(niaListSourcesTool);
  pi.registerTool(niaIndexSourceTool);
  pi.registerTool(niaSearchTool);
  pi.registerTool(niaWebSearchTool);
  pi.registerTool(niaPackageSearchTool);
  pi.registerTool(niaOracleTool);
}

export default nia;
