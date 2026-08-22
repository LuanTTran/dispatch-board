import { CommandCenterShell } from "@/workspace/CommandCenterShell";

/** Single-route operator workspace that composes the shell. Data hooks load separately. */
export default function CommandCenterScreen(): React.ReactElement {
  return <CommandCenterShell />;
}
