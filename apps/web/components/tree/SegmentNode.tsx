export default function SegmentNode({ name, depth }: { name: string; depth: number }) {
  return <div style={{ paddingLeft: `${depth * 14}px` }} className="py-1 text-sm">• {name}</div>;
}
