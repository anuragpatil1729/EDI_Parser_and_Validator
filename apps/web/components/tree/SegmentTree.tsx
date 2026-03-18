import SegmentNode from "./SegmentNode";

type TreeNode = { name: string; children?: TreeNode[] };

function render(node: TreeNode, depth = 0): JSX.Element {
  return (
    <div key={`${node.name}-${depth}`}>
      <SegmentNode name={node.name} depth={depth} />
      {node.children?.map((child) => render(child, depth + 1))}
    </div>
  );
}

export default function SegmentTree({ tree }: { tree: TreeNode }) {
  return <div>{render(tree)}</div>;
}
