import { Resizable } from "re-resizable";
import "./resizable.css";

type ResizableProps = {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const Handle = () => {
  return <div className="react-resizable-handle react-resizable-handle-s" />;
};

const ResizableBox: React.FC<ResizableProps> = ({ children, style }) => {
  return (
    <Resizable
      style={style}
      defaultSize={{ height: 300, width: "100%" }}
      minHeight={"10vh"}
      maxHeight={"90vh"}
      enable={{
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleComponent={{
        bottom: <Handle />,
      }}
    >
      {children}
    </Resizable>
  );
};

export default ResizableBox;
