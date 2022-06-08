import { Resizable, ResizableProps } from "re-resizable";
import "./resizable.css";

type ResizableBoxProps = {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const BottomHandle = () => {
  return (
    <div className="react-resizable-handle react-resizable-handle-bottom" />
  );
};

const RightHandle = () => {
  return (
    <div className="react-resizable-handle react-resizable-handle-right" />
  );
};

const ResizableBox: React.FC<ResizableBoxProps> = ({
  direction,
  children,
  style,
}) => {
  let resizableProps: ResizableProps;
  if (direction == "horizontal") {
    resizableProps = {
      className: "resizable-horizontal",
      defaultSize: { height: "100%", width: "70vw" },
      minWidth: "20vw",
      maxWidth: "75vw",
      enable: {
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      },
      handleComponent: {
        right: <RightHandle />,
      },
    };
  } else {
    resizableProps = {
      className: "resizable-vertical",
      defaultSize: { height: 300, width: "100%" },
      minHeight: "10vh",
      maxHeight: "90vh",
      enable: {
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      },
      handleComponent: {
        bottom: <BottomHandle />,
      },
    };
  }

  return (
    <Resizable
      // style={{ overflowY: "hidden", overflowX: "hidden" }}
      {...resizableProps}
    >
      {children}
    </Resizable>
  );
};

export default ResizableBox;
