import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { niaManageResourceTool } from "../lib/tools/nia-manage-resource";
import { niaIndexSourceTool } from "../lib/tools/nia-index-source";
import { niaSearchTool } from "../lib/tools/nia-search";
import { niaWebSearchTool } from "../lib/tools/nia-web-search";
import { niaPackageSearchTool } from "../lib/tools/nia-package-search";
import { niaReadTool } from "../lib/tools/nia-read";
import { niaGrepTool } from "../lib/tools/nia-grep";
import { niaExploreTool } from "../lib/tools/nia-explore";
import { niaOracleTool } from "../lib/tools/nia-oracle";
import { niaContextTool } from "../lib/tools/nia-context";
import { niaUsageTool } from "../lib/tools/nia-usage";
import { niaTracerTool } from "../lib/tools/nia-tracer";

function nia(pi: ExtensionAPI): void {
  pi.registerTool(niaManageResourceTool);
  pi.registerTool(niaIndexSourceTool);
  pi.registerTool(niaSearchTool);
  pi.registerTool(niaWebSearchTool);
  pi.registerTool(niaPackageSearchTool);
  pi.registerTool(niaReadTool);
  pi.registerTool(niaGrepTool);
  pi.registerTool(niaExploreTool);
  pi.registerTool(niaOracleTool);
  pi.registerTool(niaContextTool);
  pi.registerTool(niaUsageTool);
  pi.registerTool(niaTracerTool);
}

export default nia;
