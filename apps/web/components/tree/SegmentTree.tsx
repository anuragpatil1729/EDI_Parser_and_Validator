import SegmentNode from "./SegmentNode";

export type TreeNode = {
  loop: string;
  segments: Array<{ id: string; elements: string[]; index: number }>;
  children: TreeNode[];
};

function renderNode(node: TreeNode, depth = 0): JSX.Element {
  return (
    <div key={`${node.loop}-${depth}`} className="rounded border bg-white p-3">
      <SegmentNode name={node.loop} depth={depth} />
      {node.segments.map((segment) => (
        <div key={`${segment.id}-${segment.index}`} style={{ paddingLeft: `${(depth + 1) * 14}px` }} className="text-xs text-slate-700">
          {segment.id}: {segment.elements.join("*")}
        </div>
      ))}
      <div className="mt-1 space-y-1">
        {node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    </div>
  );
}

export default function SegmentTree({ tree }: { tree: TreeNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold">Loop Tree</h3>
      {renderNode(tree)}
    </section>
  );
}
