type Props = {
  name: string;
  depth?: number;
};

export default function SegmentNode({ name, depth = 0 }: Props) {
  return <div style={{ paddingLeft: depth * 12 }}>{name}</div>;
}
