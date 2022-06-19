import "./add-cell.css";
import { useActions } from "../hooks";
import Button from "./button";

type AddCellProps = {
  previousCellId: string | null;
  forceVisible?: boolean;
};

const AddCell: React.FC<AddCellProps> = ({
  previousCellId: previousCellId,
  forceVisible = false,
}) => {
  const { insertCellAfter: insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className="add-button">
        <Button
          iconClass="fa-plus"
          buttonClasses="is-rounded"
          spanClasses="is-small"
          onClick={() => insertCellAfter(previousCellId, "code")}
        >
          Code
        </Button>
        <Button
          iconClass="fa-plus"
          buttonClasses="is-rounded"
          spanClasses="is-small"
          onClick={() => insertCellAfter(previousCellId, "text")}
        >
          Text
        </Button>
      </div>
      <div className="divider" />
    </div>
  );
};

export default AddCell;
